<?php

namespace App\Http\Controllers;

use App\Models\Staff;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class StaffController extends Controller
{
    public function index()
    {
        $staff = Staff::with('user')->get();
        return Inertia::render('Business/Staff/Index', [
            'staff' => $staff
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'bio' => 'nullable|string',
        ]);

        $user = Auth::user();
        $business = $user->businesses()->first();

        if (!$business) {
            abort(403, 'User does not have a business.');
        }

        // Create User for Staff
        // Note: In a real app, we might send an invitation email. 
        // Here we set a temporary password.
        $staffUser = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make('password'), // Default password
            'role' => 'staff',
        ]);

        // Link User to Business
        $business->users()->attach($staffUser->id, ['role' => 'staff']);

        // Create Staff Profile
        $business->staff()->create([
            'user_id' => $staffUser->id,
            'name' => $validated['name'],
            'bio' => $validated['bio'] ?? null,
        ]);

        return redirect()->back();
    }

    public function update(Request $request, Staff $staff)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'bio' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $staff->update($validated);

        return redirect()->back();
    }

    public function destroy(Staff $staff)
    {
        // Check if staff has future bookings
        if ($staff->bookings()->where('start_time', '>', now())->exists()) {
            return redirect()->back()->withErrors(['staff' => 'Cannot delete staff with future bookings.']);
        }

        $staff->delete();
        return redirect()->back();
    }
}
