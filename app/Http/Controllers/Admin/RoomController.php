<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRoomRequest;
use App\Http\Requests\UpdateRoomRequest;
use App\Models\Room;
use App\Models\RoomPhoto;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class RoomController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Rooms/Index', [
            'rooms' => Room::with('photos')
                ->orderBy('room_number')
                ->get(),
        ]);
    }

    public function store(StoreRoomRequest $request)
    {
        $room = Room::create($request->validated());

        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $index => $photo) {
                $path = $photo->store('rooms', 'public');

                RoomPhoto::create([
                    'room_id' => $room->id,
                    'image_path' => $path,
                    'is_primary' => $index === 0,
                ]);
            }
        }

        return back()->with('success', 'Room created successfully.');
    }

    public function update(UpdateRoomRequest $request, Room $room)
    {
        $room->update($request->validated());

        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $photo) {
                $path = $photo->store('rooms', 'public');

                RoomPhoto::create([
                    'room_id' => $room->id,
                    'image_path' => $path,
                    'is_primary' => false,
                ]);
            }
        }

        return back()->with('success', 'Room updated successfully.');
    }

    public function destroy(Room $room)
    {
        foreach ($room->photos as $photo) {
            Storage::disk('public')->delete($photo->image_path);
        }

        $room->delete();

        return back()->with('success', 'Room deleted successfully.');
    }
}
