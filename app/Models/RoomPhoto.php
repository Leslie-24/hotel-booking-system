<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoomPhoto extends Model
{
    protected $fillable = [
        'room_id',
        'image_path',
        'is_primary',
    ];

    public function room()
    {
        return $this->belongsTo(Room::class);
    }
}
