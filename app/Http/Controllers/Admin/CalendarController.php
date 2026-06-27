<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\RoomType;
use App\Models\RoomUnit;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CalendarController extends Controller
{
    public function index(Request $request)
    {
        $month = $request->query('month', now()->format('Y-m'));

        $start = Carbon::parse($month . '-01')->startOfMonth();
        $end = (clone $start)->endOfMonth();

        $dates = collect();

        for ($date = $start->copy(); $date->lte($end); $date->addDay()) {
            $dates->push([
                'date' => $date->toDateString(),
                'day' => $date->format('d'),
                'label' => $date->format('D'),
            ]);
        }

        $roomUnits = RoomUnit::with('roomType')
            ->orderBy('room_number')
            ->get();

        $bookings = Booking::with(['roomType', 'roomUnit'])
            ->whereNotNull('room_unit_id')
            ->whereIn('status', ['pending', 'confirmed'])
            ->whereDate('checkin_date', '<=', $end->toDateString())
            ->whereDate('checkout_date', '>=', $start->toDateString())
            ->get();

        $searchResults = null;

        if ($request->filled('checkin') && $request->filled('checkout')) {
            $request->validate([
                'checkin' => ['required', 'date'],
                'checkout' => ['required', 'date', 'after:checkin'],
                'room_type_id' => ['nullable', 'exists:room_types,id'],
            ]);

            $searchResults = $this->availabilityResults($request);
        }

        return Inertia::render('Admin/Calendar/Index', [
            'month' => $start->format('Y-m'),
            'monthLabel' => $start->format('F Y'),
            'previousMonth' => $start->copy()->subMonth()->format('Y-m'),
            'nextMonth' => $start->copy()->addMonth()->format('Y-m'),
            'dates' => $dates,
            'roomUnits' => $roomUnits,
            'bookings' => $bookings,
            'roomTypes' => RoomType::where('status', 'active')
                ->orderBy('name')
                ->get(),
            'filters' => [
                'checkin' => $request->checkin,
                'checkout' => $request->checkout,
                'room_type_id' => $request->room_type_id,
            ],
            'searchResults' => $searchResults,
        ]);
    }

    private function availabilityResults(Request $request)
    {
        $checkin = $request->checkin;
        $checkout = $request->checkout;
        $roomTypeId = $request->room_type_id;

        $unitsQuery = RoomUnit::with('roomType')
            ->where('status', 'active');

        if ($roomTypeId) {
            $unitsQuery->where('room_type_id', $roomTypeId);
        }

        $units = $unitsQuery
            ->orderBy('room_number')
            ->get();

        $busyUnitIds = Booking::whereNotNull('room_unit_id')
            ->whereIn('status', ['pending', 'confirmed'])
            ->where('stay_status', '!=', 'checked_out')
            ->where('checkin_date', '<', $checkout)
            ->where('checkout_date', '>', $checkin)
            ->pluck('room_unit_id')
            ->toArray();

        $available = [];
        $busy = [];

        foreach ($units as $unit) {
            $item = [
                'id' => $unit->getKey(),
                'room_number' => $unit->room_number,
                'room_type_id' => $unit->room_type_id,
                'room_type_name' => $unit->roomType?->name,
            ];

            if (in_array($unit->getKey(), $busyUnitIds)) {
                $busy[] = $item;
            } else {
                $available[] = $item;
            }
        }

        return [
            'available' => $available,
            'busy' => $busy,
        ];
    }
}
