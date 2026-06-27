<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookingStatusLog extends Model
{
    protected $fillable = [
        'booking_id',
        'user_id',
        'old_status',
        'new_status',
        'note',
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }
}
