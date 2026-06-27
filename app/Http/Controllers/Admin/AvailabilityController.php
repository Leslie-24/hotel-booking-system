<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RoomType;
use App\Models\RoomTypeAvailability;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AvailabilityController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Availability/Index', [
            'roomTypes' => RoomType::where('status', 'active')
                ->orderBy('name')
                ->get(),

            'availability' => RoomTypeAvailability::with('roomType')
                ->orderBy('date')
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'room_type_id' => ['required', 'exists:room_types,id'],
            'date' => ['required', 'date'],
            'blocked_rooms' => ['required', 'integer', 'min:0'],
            'reason' => ['nullable', 'string', 'max:255'],
        ]);

        $roomType = RoomType::findOrFail($validated['room_type_id']);

        if ($validated['blocked_rooms'] > $roomType->total_rooms) {
            return back()->withErrors([
                'blocked_rooms' => 'Blocked rooms cannot exceed total rooms.',
            ]);
        }

        RoomTypeAvailability::updateOrCreate(
            [
                'room_type_id' => $validated['room_type_id'],
                'date' => $validated['date'],
            ],
            [
                'blocked_rooms' => $validated['blocked_rooms'],
                'reason' => $validated['reason'] ?? null,
            ],
        );

        return back()->with('success', 'Availability updated.');
    }

    public function destroy(RoomTypeAvailability $availability)
    {
        $availability->delete();

        return back()->with('success', 'Availability record removed.');
    }
}
