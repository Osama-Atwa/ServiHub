<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Business extends Model
{
    protected $fillable = ['name', 'slug', 'brand_color', 'logo_path', 'status'];

    public function services()
    {
        return $this->hasMany(Service::class);
    }

    public function staff()
    {
        return $this->hasMany(Staff::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class)->withPivot('role');
    }
}
