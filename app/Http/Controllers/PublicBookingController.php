<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\RoomType;
use App\Models\RoomTypeAvailability;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Mail\BookingRequestReceived;
use Illuminate\Support\Facades\Mail;
use App\Mail\NewBookingNotification;

class PublicBookingController extends Controller
{
    public function home()
    {
        return Inertia::render('Public/Home', [
            'featuredRooms' => RoomType::with([
                'photos' => fn ($query) => $query->orderByDesc('is_primary'),
            ])
                ->where('status', 'active')
                ->limit(3)
                ->get(),
        ]);
    }

    public function rooms()
    {
        return Inertia::render('Public/Rooms', [
            'rooms' => RoomType::with([
                'photos' => fn ($query) => $query->orderByDesc('is_primary'),
            ])
                ->where('status', 'active')
                ->orderBy('price_per_night')
                ->get(),
        ]);
    }

    public function search(Request $request)
    {
        $validated = $request->validate([
            'checkin' => ['nullable', 'date', 'after_or_equal:today'],
            'checkout' => ['nullable', 'date', 'after:checkin'],
            'adults' => ['nullable', 'integer', 'min:1'],
            'children' => ['nullable', 'integer', 'min:0'],
        ]);

        $rooms = [];

        if (!empty($validated['checkin']) && !empty($validated['checkout'])) {
            $checkin = $validated['checkin'];
            $checkout = $validated['checkout'];
            $adults = $validated['adults'] ?? 1;
            $children = $validated['children'] ?? 0;

            $rooms = RoomType::with([
                'photos' => fn ($query) => $query->orderByDesc('is_primary'),
            ])
                ->where('status', 'active')
                ->where('max_adults', '>=', $adults)
                ->where('max_children', '>=', $children)
                ->get()
                ->map(function ($roomType) use ($checkin, $checkout, $adults, $children) {
                    $nights = Carbon::parse($checkin)->diffInDays(Carbon::parse($checkout));

                    $bookedRooms = Booking::where('room_type_id', $roomType->id)
                        ->whereIn('status', ['pending', 'confirmed'])
                        ->where('checkin_date', '<', $checkout)
                        ->where('checkout_date', '>', $checkin)
                        ->sum('quantity');

                    $blockedRooms = RoomTypeAvailability::where('room_type_id', $roomType->id)
                        ->whereDate('date', '>=', $checkin)
                        ->whereDate('date', '<', $checkout)
                        ->max('blocked_rooms') ?? 0;

                    $availableRooms = max(0, $roomType->total_rooms - $bookedRooms - $blockedRooms);

                    $roomType->nights = $nights;
                    $roomType->total_amount = $nights * $roomType->price_per_night;
                    $roomType->checkin = $checkin;
                    $roomType->checkout = $checkout;
                    $roomType->adults = $adults;
                    $roomType->children = $children;
                    $roomType->available_rooms = $availableRooms;

                    return $roomType;
                })
                ->filter(fn ($roomType) => $roomType->available_rooms > 0)
                ->values();
        }

        return Inertia::render('Public/BookingSearch', [
            'rooms' => $rooms,
            'filters' => [
                'checkin' => $request->checkin,
                'checkout' => $request->checkout,
                'adults' => $request->adults ?? 2,
                'children' => $request->children ?? 0,
            ],
        ]);
    }

    public function confirm(Request $request)
    {
        $validated = $request->validate([
            'room_type_id' => ['required', 'exists:room_types,id'],
            'checkin' => ['required', 'date', 'after_or_equal:today'],
            'checkout' => ['required', 'date', 'after:checkin'],
            'adults' => ['required', 'integer', 'min:1'],
            'children' => ['nullable', 'integer', 'min:0'],
        ]);

        $roomType = RoomType::with([
            'photos' => fn ($query) => $query->orderByDesc('is_primary'),
        ])->findOrFail($validated['room_type_id']);

        $nights = Carbon::parse($validated['checkin'])
            ->diffInDays(Carbon::parse($validated['checkout']));

        $roomType->total_amount = $nights * $roomType->price_per_night;

        return Inertia::render('Public/BookingForm', [
            'room' => $roomType,
            'filters' => $validated,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'room_type_id' => ['required', 'exists:room_types,id'],
            'checkin' => ['required', 'date', 'after_or_equal:today'],
            'checkout' => ['required', 'date', 'after:checkin'],
            'adults' => ['required', 'integer', 'min:1'],
            'children' => ['nullable', 'integer', 'min:0'],
            'guest_name' => ['required', 'string', 'max:120'],
            'guest_email' => ['required', 'email', 'max:150'],
            'guest_phone' => ['required', 'string', 'max:50'],
            'special_request' => ['nullable', 'string', 'max:1000'],
        ]);

        return DB::transaction(function () use ($validated) {
            $roomType = RoomType::where('id', $validated['room_type_id'])
                ->lockForUpdate()
                ->firstOrFail();

            $children = $validated['children'] ?? 0;

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

            $availableRooms = $roomType->total_rooms - $bookedRooms - $blockedRooms;

            if ($availableRooms < 1) {
                return back()->withErrors([
                    'room_type_id' => 'Sorry, this room type is no longer available for those dates.',
                ]);
            }

            $nights = Carbon::parse($validated['checkin'])
                ->diffInDays(Carbon::parse($validated['checkout']));

            $booking = Booking::create([
                'room_type_id' => $roomType->id,
                'quantity' => 1,
                'booking_reference' => 'PV-' . strtoupper(Str::random(8)),
                'guest_name' => $validated['guest_name'],
                'guest_email' => $validated['guest_email'],
                'guest_phone' => $validated['guest_phone'],
                'checkin_date' => $validated['checkin'],
                'checkout_date' => $validated['checkout'],
                'adults' => $validated['adults'],
                'children' => $children,
                'total_amount' => $nights * $roomType->price_per_night,
                'special_request' => $validated['special_request'] ?? null,
                'status' => 'pending',
            ]);
            Mail::to($booking->guest_email)
    ->send(new BookingRequestReceived($booking));
    $booking->load('roomType');

Mail::to(config('mail.from.address'))
    ->send(new NewBookingNotification($booking));

            return redirect()->route('booking.success', $booking);
        });
    }

    public function success(Booking $booking)
    {
        $booking->load('roomType');

        return Inertia::render('Public/BookingSuccess', [
            'booking' => $booking,
        ]);
    }
}
