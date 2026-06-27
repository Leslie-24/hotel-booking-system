<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'room_type_id',
        'quantity',
        'room_unit_id',
        'stay_status',
        'checked_in_at',
        'checked_out_at',
        'booking_reference',
        'guest_name',
        'guest_email',
        'guest_phone',
        'checkin_date',
        'checkout_date',
        'adults',
        'children',
        'total_amount',
        'special_request',
        'status',
        'payment_status',
        'amount_paid',
    ];

    public function roomType()
{
    return $this->belongsTo(RoomType::class);
}
public function roomUnit()
{
    return $this->belongsTo(RoomUnit::class);
}
    public function logs()
    {
        return $this->hasMany(BookingStatusLog::class);
    }
    public function activityLogs()
{
    return $this->hasMany(BookingActivityLog::class);
}
}
