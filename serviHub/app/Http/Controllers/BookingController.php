<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Service;
use App\Models\Staff;
use App\Services\BookingAvailabilityService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BookingController extends Controller
{
    protected $availabilityService;

    public function __construct(BookingAvailabilityService $availabilityService)
    {
        $this->availabilityService = $availabilityService;
    }

    public function index()
    {
        // List bookings for the authenticated user (Client or Business)
        $user = Auth::user();
        
        if ($user->isClient()) {
            $bookings = $user->bookings()->with(['business', 'service', 'staff'])->get();
        } elseif ($user->isBusinessAdmin() || $user->isStaff()) {
            // For Business Admin/Staff, business bookings are scoped by BusinessScope
            // But we need to querying Booking model directly.
            $bookings = Booking::with(['client', 'service', 'staff'])->get();
        } else {
            $bookings = [];
        }

        return Inertia::render('Bookings/Index', [
            'bookings' => $bookings
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'service_id' => 'required|exists:services,id',
            'staff_id' => 'required|exists:staff,id', // For now ensure staff is picked
            'start_time' => 'required|date|after:now',
        ]);

        $service = Service::findOrFail($validated['service_id']);
        $staff = Staff::findOrFail($validated['staff_id']);
        $startTime = Carbon::parse($validated['start_time']);
        $date = $startTime->copy()->startOfDay();

        // 1. Double check availability
        $slots = $this->availabilityService->calculateAvailability($service, $date, $staff);
        $requestedTimeSlot = $startTime->format('H:i');

        if (!in_array($requestedTimeSlot, $slots)) {
            return back()->withErrors(['start_time' => 'This time slot is no longer available.']);
        }

        // 2. Create Booking
        Booking::create([
            'business_id' => $service->business_id,
            'service_id' => $service->id,
            'staff_id' => $staff->id,
            'client_id' => Auth::id(),
            'start_time' => $startTime,
            'end_time' => $startTime->copy()->addMinutes($service->duration_minutes),
            'status' => 'confirmed', // Auto-confirm for MVP
        ]);

        return redirect()->route('bookings.index')->with('success', 'Booking created successfully!');
    }

    public function checkAvailability(Request $request)
    {
        $request->validate([
            'service_id' => 'required|exists:services,id',
            'staff_id' => 'nullable|exists:staff,id',
            'date' => 'required|date|after_or_equal:today',
        ]);

        $service = Service::findOrFail($request->service_id);
        $staff = $request->staff_id ? Staff::findOrFail($request->staff_id) : null;
        $date = Carbon::parse($request->date);

        $slots = $this->availabilityService->calculateAvailability($service, $date, $staff);

        return response()->json(['slots' => $slots]);
    }
}
