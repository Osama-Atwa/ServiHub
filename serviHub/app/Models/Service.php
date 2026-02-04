<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Business;
use App\Models\Booking;

use App\Scopes\BusinessScope;

class Service extends Model
{
    protected $fillable = ['business_id', 'name', 'description', 'duration_minutes', 'price', 'is_active'];

    protected static function booted(): void
    {
        static::addGlobalScope(new BusinessScope);
    }

    public function business()
    {
        return $this->belongsTo(Business::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
