<?php

namespace App\Http\Controllers;

use App\Mail\BookingCancelled;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class PublicBookingLookupController extends Controller
{
    public function index()
    {
        return Inertia::render('Public/ManageBooking');
    }

    public function lookup(Request $request)
    {
        $validated = $request->validate([
            'booking_reference' => ['required', 'string'],
            'guest_phone' => ['required', 'string'],
        ]);

        $booking = Booking::with(['roomType', 'roomUnit'])
            ->where('booking_reference', trim($validated['booking_reference']))
            ->where('guest_phone', trim($validated['guest_phone']))
            ->first();

        if (!$booking) {
            return back()->withErrors([
                'booking_reference' => 'No booking found with those details.',
            ]);
        }

        return Inertia::render('Public/ManageBooking', [
            'booking' => $booking,
        ]);
    }

    public function cancel(Request $request)
    {
        $validated = $request->validate([
            'booking_reference' => ['required', 'string'],
            'guest_phone' => ['required', 'string'],
        ]);

        $booking = Booking::with(['roomType', 'roomUnit'])
            ->where('booking_reference', trim($validated['booking_reference']))
            ->where('guest_phone', trim($validated['guest_phone']))
            ->first();

        if (!$booking) {
            return back()->withErrors([
                'booking_reference' => 'No booking found with those details.',
            ]);
        }

        if ($booking->stay_status === 'checked_in') {
            return back()->withErrors([
                'booking_reference' => 'This booking cannot be cancelled because the guest is already checked in.',
            ]);
        }

        if ($booking->status === 'cancelled') {
            return back()->withErrors([
                'booking_reference' => 'This booking is already cancelled.',
            ]);
        }

        $booking->update([
            'status' => 'cancelled',
        ]);

        if ($booking->guest_email) {
            Mail::to($booking->guest_email)
                ->send(new BookingCancelled($booking));
        }

        return Inertia::render('Public/CancelBookingSuccess', [
            'booking' => $booking,
        ]);
    }
}
