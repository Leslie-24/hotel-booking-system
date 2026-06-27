<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRoomTypeRequest;
use App\Http\Requests\UpdateRoomTypeRequest;
use App\Models\RoomType;
use App\Models\RoomTypePhoto;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class RoomTypeController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/RoomTypes/Index', [
            'roomTypes' => RoomType::with([
                'photos' => fn ($query) => $query->orderByDesc('is_primary'),
'units' => fn ($query) => $query->orderBy('room_number'),
            ])
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function store(StoreRoomTypeRequest $request)
    {
        $roomType = RoomType::create($request->validated());

        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $index => $photo) {
                $path = $photo->store('room-types', 'public');

                RoomTypePhoto::create([
                    'room_type_id' => $roomType->id,
                    'image_path' => $path,
                    'is_primary' => $index === 0,
                ]);
            }
        }

        return back()->with('success', 'Room type created successfully.');
    }

    public function update(UpdateRoomTypeRequest $request, RoomType $roomType)
    {
        $roomType->update($request->validated());

        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $photo) {
                $path = $photo->store('room-types', 'public');

                RoomTypePhoto::create([
                    'room_type_id' => $roomType->id,
                    'image_path' => $path,
                    'is_primary' => false,
                ]);
            }
        }

        return back()->with('success', 'Room type updated successfully.');
    }

    public function destroy(RoomType $roomType)
    {
        foreach ($roomType->photos as $photo) {
            Storage::disk('public')->delete($photo->image_path);
        }

        $roomType->delete();

        return back()->with('success', 'Room type deleted successfully.');
    }
}
