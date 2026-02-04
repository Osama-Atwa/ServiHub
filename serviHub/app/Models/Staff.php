<?php

namespace App\Models;

use App\Models\Booking;
use App\Models\Business;
use App\Models\StaffAvailability;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

use App\Scopes\BusinessScope;

class Staff extends Model
{
    protected $fillable = ['business_id', 'user_id', 'name', 'bio', 'avatar_path', 'is_active'];

    protected static function booted(): void
    {
        static::addGlobalScope(new BusinessScope);
    }

    public function business()
    {
        return $this->belongsTo(Business::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function availabilities()
    {
        return $this->hasMany(StaffAvailability::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
