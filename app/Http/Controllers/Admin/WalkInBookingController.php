<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\RoomType;
use App\Models\RoomTypeAvailability;
use App\Models\RoomUnit;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Models\BookingActivityLog;

class WalkInBookingController extends Controller
{
    public function create()
    {
        return Inertia::render('Admin/WalkInBookings/Create', [
            'roomTypes' => RoomType::where('status', 'active')
                ->orderBy('name')
                ->get(),

            'roomUnits' => RoomUnit::with('roomType')
                ->where('status', 'active')
                ->orderBy('room_number')
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'room_type_id' => ['required', 'exists:room_types,id'],
            'room_unit_id' => ['nullable', 'exists:room_units,id'],
            'guest_name' => ['required', 'string', 'max:120'],
            'guest_email' => ['nullable', 'email', 'max:150'],
            'guest_phone' => ['required', 'string', 'max:50'],
            'checkin' => ['required', 'date'],
            'checkout' => ['required', 'date', 'after:checkin'],
            'adults' => ['required', 'integer', 'min:1'],
            'children' => ['nullable', 'integer', 'min:0'],
            'special_request' => ['nullable', 'string', 'max:1000'],
            'check_in_now' => ['boolean'],
        ]);

        return DB::transaction(function () use ($validated) {
            $roomType = RoomType::lockForUpdate()->findOrFail($validated['room_type_id']);
            $children = $validated['children'] ?? 0;

            if (
                $validated['adults'] > $roomType->max_adults ||
                $children > $roomType->max_children
            ) {
                return back()->withErrors([
                    'room_type_id' => 'This room type cannot accommodate the selected guests.',
                ]);
            }

            $bookedRooms = Booking::where('room_type_id', $roomType->id)
                ->whereIn('status', ['pending', 'confirmed'])
                ->where('checkin_date', '<', $validated['checkout'])
                ->where('checkout_date', '>', $validated['checkin'])
                ->sum('quantity');

            $blockedRooms = RoomTypeAvailability::where('room_type_id', $roomType->id)
                ->whereDate('date', '>=', $validated['checkin'])
                ->whereDate('date', '<', $validated['checkout'])
                ->lockForUpdate()
                ->max('blocked_rooms') ?? 0;

            if (($roomType->total_rooms - $bookedRooms - $blockedRooms) < 1) {
                return back()->withErrors([
                    'room_type_id' => 'No rooms available for those dates.',
                ]);
            }

            $roomUnitId = $validated['room_unit_id'] ?? null;

            if ($roomUnitId) {
                $roomUnit = RoomUnit::findOrFail($roomUnitId);

                if ($roomUnit->room_type_id !== $roomType->id) {
                    return back()->withErrors([
                        'room_unit_id' => 'Selected room number does not belong to this room type.',
                    ]);
                }

                $conflict = Booking::where('room_unit_id', $roomUnitId)
                    ->whereIn('status', ['pending', 'confirmed'])
                    ->where('stay_status', '!=', 'checked_out')
                    ->where('checkin_date', '<', $validated['checkout'])
                    ->where('checkout_date', '>', $validated['checkin'])
                    ->exists();

                if ($conflict) {
                    return back()->withErrors([
                        'room_unit_id' => 'This room number is already assigned for those dates.',
                    ]);
                }
            }

            $nights = Carbon::parse($validated['checkin'])
                ->diffInDays(Carbon::parse($validated['checkout']));

            $booking = Booking::create([
                'room_type_id' => $roomType->id,
                'room_unit_id' => $roomUnitId,
                'quantity' => 1,
                'booking_reference' => 'PV-' . strtoupper(Str::random(8)),
                'guest_name' => $validated['guest_name'],
                'guest_email' => $validated['guest_email'] ?? null,
                'guest_phone' => $validated['guest_phone'],
                'checkin_date' => $validated['checkin'],
                'checkout_date' => $validated['checkout'],
                'adults' => $validated['adults'],
                'children' => $children,
                'total_amount' => $nights * $roomType->price_per_night,
                'special_request' => $validated['special_request'] ?? null,
                'status' => 'confirmed',
                'stay_status' => !empty($validated['check_in_now'])
                    ? 'checked_in'
                    : 'not_checked_in',
                'checked_in_at' => !empty($validated['check_in_now'])
                    ? now()
                    : null,
            ]);

            BookingActivityLog::create([
                'booking_id' => $booking->id,
                'user_id' => request()->user()?->getKey(),
                'action' => 'created',
                'description' => 'Walk-in booking created.',
            ]);

            return redirect()
                ->route('admin.bookings.index')
                ->with('success', 'Walk-in booking created.');
        });
    }
}
