<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    protected $fillable = [
        'room_number',
        'room_type',
        'description',
        'amenities',
        'price_per_night',
        'max_adults',
        'max_children',
        'status'
    ];
    protected $casts = [
    'amenities' => 'array',
];

    public function photos()
    {
        return $this->hasMany(RoomPhoto::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function availability()
    {
        return $this->hasMany(RoomAvailability::class);
    }
}
