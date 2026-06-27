<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoomTypeAvailability extends Model
{
    protected $fillable = [
        'room_type_id',
        'date',
        'blocked_rooms',
        'reason',
    ];

    public function roomType()
    {
        return $this->belongsTo(RoomType::class);
    }
}
