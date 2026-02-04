<?php

namespace App\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;
use Illuminate\Support\Facades\Auth;

class BusinessScope implements Scope
{
    /**
     * Apply the scope to a given Eloquent query builder.
     */
    public function apply(Builder $builder, Model $model): void
    {
        if (Auth::check()) {
            $user = Auth::user();

            // If user is a Business Admin or Staff, filter by their Business ID
            if ($user->role === 'business_admin' || $user->role === 'staff') {
                // Assuming the user is linked to businesses via the pivot table
                // For simplicity in this scope, we might need a way to determine *which* business context is active
                // However, for a simple multi-tenant setup where a user belongs to ONE business mainly (or we filter by all their businesses)
                
                // Strategy: Get IDs of businesses the user belongs to
                $businessIds = $user->businesses()->pluck('businesses.id')->toArray();
                
                if (!empty($businessIds)) {
                    $builder->whereIn('business_id', $businessIds);
                }
            }
            // Platform Admin sees everything (no filter)
            // Clients see everything (public marketplace) - unless we are in a specific context?
            // For now, let's strictly limit Business Admin/Staff to their data.
        }
    }
}
