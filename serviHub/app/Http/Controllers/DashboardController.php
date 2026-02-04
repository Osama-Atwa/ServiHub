<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Booking;
use App\Models\User;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $stats = [];

        if ($user->isBusinessAdmin() || $user->isStaff()) {
            $business = $user->businesses()->first(); 

            if ($business) {
                $bookingsQuery = $business->bookings();

                $totalBookings = $bookingsQuery->count();
                $upcomingBookings = $bookingsQuery->where('start_time', '>', now())->count();
                
                // Revenue (Sum of service prices for all bookings)
                $revenue = $bookingsQuery->with('service')->get()->sum(function($booking) {
                    return $booking->service ? $booking->service->price : 0;
                });

                // Top Staff
                 $popularStaff = $business->staff()
                    ->withCount('bookings')
                    ->orderByDesc('bookings_count')
                    ->take(3)
                    ->get()
                    ->map(function($staff) {
                        return [
                            'name' => $staff->name,
                            'bookings' => $staff->bookings_count,
                        ];
                    });

                $stats = [
                    'total_bookings' => $totalBookings,
                    'upcoming_bookings' => $upcomingBookings,
                    'total_revenue' => number_format($revenue, 2),
                    'popular_staff' => $popularStaff
                ];
            }
        } elseif ($user->isClient()) {
            $clientBookings = $user->bookings(); 
            
            $totalBookings = $clientBookings->count();
            $upcomingBookings = $clientBookings->where('start_time', '>', now())->count();
            $spent = $clientBookings->with('service')->get()->sum(function($booking) {
                    return $booking->service ? $booking->service->price : 0;
            });

            $stats = [
                'total_bookings' => $totalBookings,
                'upcoming_bookings' => $upcomingBookings,
                'total_spent' => number_format($spent, 2),
            ];
        }

        return Inertia::render('Dashboard', [
            'stats' => $stats
        ]);
    }
}
