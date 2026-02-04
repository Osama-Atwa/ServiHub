<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Business;
use App\Models\Booking;

class Service extends Model
{
    protected $fillable = ['business_id', 'name', 'description', 'duration_minutes', 'price', 'is_active'];

    public function business()
    {
        return $this->belongsTo(Business::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
