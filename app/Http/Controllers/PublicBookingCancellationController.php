<?php

namespace App\Http\Controllers;

use App\Mail\BookingCancelled;
use App\Models\Booking;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class PublicBookingCancellationController extends Controller
{
    public function show(Booking $booking)
    {
        $booking->load(['roomType', 'roomUnit']);

        return Inertia::render('Public/CancelBooking', [
            'booking' => $booking,
        ]);
    }

    public function cancel(Booking $booking)
    {
        if ($booking->stay_status === 'checked_in') {
            return back()->withErrors([
                'booking' => 'This booking cannot be cancelled because the guest is already checked in.',
            ]);
        }

        if ($booking->status === 'cancelled') {
            return back()->withErrors([
                'booking' => 'This booking is already cancelled.',
            ]);
        }

        $booking->update([
            'status' => 'cancelled',
        ]);

        $booking->load(['roomType', 'roomUnit']);

        if ($booking->guest_email) {
            Mail::to($booking->guest_email)
                ->send(new BookingCancelled($booking));
        }

        return Inertia::render('Public/CancelBookingSuccess', [
            'booking' => $booking,
        ]);
    }
}
