<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RoomTypePhoto;
use Illuminate\Support\Facades\Storage;

class RoomPhotoController extends Controller
{
    public function makePrimary(RoomTypePhoto $photo)
    {
        RoomTypePhoto::where('room_type_id', $photo->room_type_id)
            ->update(['is_primary' => false]);

        $photo->update(['is_primary' => true]);

        return back()->with('success', 'Primary photo updated.');
    }

    public function destroy(RoomTypePhoto $photo)
    {
        Storage::disk('public')->delete($photo->image_path);

        $photo->delete();

        return back()->with('success', 'Photo deleted.');
    }
}
