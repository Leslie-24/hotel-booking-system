<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RoomUnit;
use Illuminate\Http\Request;

class RoomUnitController extends Controller
{
    public function store(Request $request)
{
    $validated = $request->validate([
        'room_type_id' => ['required', 'exists:room_types,id'],
        'room_number' => ['required', 'string', 'max:1000'],
        'status' => ['required', 'in:active,inactive,maintenance'],
    ]);

    $input = trim($validated['room_number']);
    $numbers = [];

    if (preg_match('/^\d+\-\d+$/', $input)) {
        [$start, $end] = array_map('intval', explode('-', $input));

        if ($end < $start || ($end - $start) > 300) {
            return back()->withErrors([
                'room_number' => 'Invalid room range.',
            ]);
        }

        for ($i = $start; $i <= $end; $i++) {
            $numbers[] = (string) $i;
        }
    } else {
        $numbers = preg_split('/[\s,]+/', $input);
    }

    foreach ($numbers as $number) {
        $number = trim($number);

        if ($number === '') {
            continue;
        }

        RoomUnit::firstOrCreate(
            [
                'room_type_id' => $validated['room_type_id'],
                'room_number' => $number,
            ],
            [
                'status' => $validated['status'],
            ]
        );
    }

    return back()->with('success', 'Room units added.');
}

    public function update(Request $request, RoomUnit $roomUnit)
    {
        $validated = $request->validate([
            'room_number' => ['required', 'string', 'max:50'],
            'status' => ['required', 'in:active,inactive,maintenance'],
        ]);

        $roomUnit->update($validated);

        return back()->with('success', 'Room unit updated.');
    }

    public function destroy(RoomUnit $roomUnit)
    {
        $roomUnit->delete();

        return back()->with('success', 'Room unit deleted.');
    }
}
