<?php

namespace App\Http\Controllers;

use App\Models\Business;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MarketplaceController extends Controller
{
    /**
     * Display a listing of businesses (Marketplace Home).
     */
    public function index()
    {
        // Fetch active businesses
        $businesses = Business::where('status', 'active')
            ->select('id', 'name', 'slug', 'brand_color', 'logo_path')
            ->get();

        return Inertia::render('Marketplace/Index', [
            'businesses' => $businesses
        ]);
    }

    /**
     * Display the specified business.
     */
    public function show($slug)
    {
        $business = Business::where('slug', $slug)
            ->where('status', 'active')
            ->with(['services' => function ($query) {
                $query->where('is_active', true);
            }, 'staff' => function ($query) {
                $query->where('is_active', true);
            }])
            ->firstOrFail();

        return Inertia::render('Marketplace/Show', [
            'business' => $business
        ]);
    }
}
