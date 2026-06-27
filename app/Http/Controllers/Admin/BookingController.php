<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\BookingCancelled;
use App\Mail\BookingConfirmed;
use App\Models\Booking;
use App\Models\BookingActivityLog;
use App\Models\RoomUnit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class BookingController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Bookings/Index', [
            'bookings' => Booking::with([
                'roomType',
                'roomUnit',
                'activityLogs.user',
            ])
                ->latest()
                ->get(),

            'roomUnits' => RoomUnit::with('roomType')
                ->where('status', 'active')
                ->whereDoesntHave('bookings', function ($query) {
                    $query->where('stay_status', 'checked_in');
                })
                ->orderBy('room_number')
                ->get(),
        ]);
    }

    public function updateStatus(Request $request, Booking $booking)
    {
        $request->validate([
            'status' => ['required', 'in:pending,confirmed,cancelled'],
            'note' => ['nullable', 'string', 'max:500'],
        ]);

        $booking->update([
            'status' => $request->status,
        ]);

        $this->logActivity(
            $booking,
            'status_updated',
            'Booking status changed to ' . $request->status
        );

        if ($request->status === 'confirmed') {
            $booking->load(['roomType', 'roomUnit']);

            if ($booking->guest_email) {
                Mail::to($booking->guest_email)
                    ->send(new BookingConfirmed($booking));
            }
        }

        if ($request->status === 'cancelled') {
            $booking->load(['roomType', 'roomUnit']);

            if ($booking->guest_email) {
                Mail::to($booking->guest_email)
                    ->send(new BookingCancelled($booking));
            }
        }

        return back()->with('success', 'Booking status updated.');
    }

    public function updatePayment(Request $request, Booking $booking)
    {
        $validated = $request->validate([
            'payment_status' => [
                'required',
                'in:pending,partially_paid,paid,refunded',
            ],
            'amount_paid' => ['required', 'numeric', 'min:0'],
        ]);

        if ((float) $validated['amount_paid'] > (float) $booking->total_amount) {
            return back()->withErrors([
                'amount_paid' => 'Amount paid cannot exceed total amount.',
            ]);
        }

        $booking->update([
            'payment_status' => $validated['payment_status'],
            'amount_paid' => $validated['amount_paid'],
        ]);

        $this->logActivity(
            $booking,
            'payment_updated',
            'Payment updated to ' . $validated['payment_status'] .
                ' with amount paid $' . number_format((float) $validated['amount_paid'], 2)
        );

        return back()->with('success', 'Payment updated.');
    }

    public function assignRoom(Request $request, Booking $booking)
    {
        $validated = $request->validate([
            'room_unit_id' => ['required', 'exists:room_units,id'],
        ]);

        $roomUnit = RoomUnit::findOrFail($validated['room_unit_id']);

        if ($roomUnit->room_type_id !== $booking->room_type_id) {
            return back()->withErrors([
                'room_unit_id' => 'Selected room does not belong to this room type.',
            ]);
        }

        $conflict = Booking::where('room_unit_id', $roomUnit->getKey())
            ->where('id', '!=', $booking->getKey())
            ->whereIn('status', ['pending', 'confirmed'])
            ->where('stay_status', '!=', 'checked_out')
            ->where('checkin_date', '<', $booking->checkout_date)
            ->where('checkout_date', '>', $booking->checkin_date)
            ->exists();

        if ($conflict) {
            return back()->withErrors([
                'room_unit_id' => 'This room is already assigned for those dates.',
            ]);
        }

        $booking->update([
            'room_unit_id' => $roomUnit->getKey(),
        ]);

        $this->logActivity(
            $booking,
            'room_assigned',
            'Room ' . $roomUnit->room_number . ' assigned to booking.'
        );

        return back()->with('success', 'Room assigned.');
    }

    public function checkIn(Booking $booking)
    {
        if (!$booking->room_unit_id) {
            return back()->withErrors([
                'room_unit_id' => 'Assign a room number before check-in.',
            ]);
        }

        $booking->update([
            'status' => 'confirmed',
            'stay_status' => 'checked_in',
            'checked_in_at' => now(),
        ]);

        $this->logActivity(
            $booking,
            'checked_in',
            'Guest checked in and room marked occupied.'
        );

        return back()->with('success', 'Guest checked in.');
    }

    public function checkOut(Booking $booking)
    {
        $booking->update([
            'stay_status' => 'checked_out',
            'checked_out_at' => now(),
        ]);

        $this->logActivity(
            $booking,
            'checked_out',
            'Guest checked out and room released.'
        );

        return back()->with('success', 'Guest checked out.');
    }

    private function logActivity(
        Booking $booking,
        string $action,
        ?string $description = null
    ): void {
        BookingActivityLog::create([
            'booking_id' => $booking->getKey(),
            'user_id' => request()->user()?->getKey(),
            'action' => $action,
            'description' => $description,
        ]);
    }
}
