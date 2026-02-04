<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ServiceController extends Controller
{
    public function index()
    {
        // BusinessScope will automatically filter services for the authenticated business user
        $services = Service::all();
        return Inertia::render('Business/Services/Index', [
            'services' => $services
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'duration_minutes' => 'required|integer|min:5',
            'price' => 'required|numeric|min:0',
        ]);

        // Determine current business. For MVP, assuming the user's first business context.
        // In a real multi-business scenario, business_id should be in the session or request.
        $user = Auth::user();
        $business = $user->businesses()->first();

        if (!$business) {
            abort(403, 'User does not have a business.');
        }

        $business->services()->create($validated);

        return redirect()->back();
    }

    public function update(Request $request, Service $service)
    {
        // Verify policy/ownership if necessary (BusinessScope handles retrieval, but explicit check is good)
        // For now, relying on Scope + standard authorization
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'duration_minutes' => 'required|integer|min:5',
            'price' => 'required|numeric|min:0',
            'is_active' => 'boolean',
        ]);

        $service->update($validated);

        return redirect()->back();
    }

    public function destroy(Service $service)
    {
        $service->delete();
        return redirect()->back();
    }
}
