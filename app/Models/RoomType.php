<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoomType extends Model
{
    protected $fillable = [
        'name',
        'description',
        'amenities',
        'price_per_night',
        'max_adults',
        'max_children',
        'total_rooms',
        'status',
    ];

    protected $casts = [
        'amenities' => 'array',
    ];

    public function photos()
    {
        return $this->hasMany(RoomTypePhoto::class);
    }

    public function availability()
    {
        return $this->hasMany(RoomTypeAvailability::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
    public function units()
{
    return $this->hasMany(RoomUnit::class);
}
}
