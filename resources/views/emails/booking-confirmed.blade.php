<h2>Booking Confirmed</h2>

<p>Dear {{ $booking->guest_name }},</p>

<p>
We are pleased to confirm your reservation at Poolside Villa.
</p>

<p>
Booking Reference:
<strong>{{ $booking->booking_reference }}</strong>
</p>

<p>
Room Type:
<strong>{{ $booking->roomType->name }}</strong>
</p>

<p>
Check In: {{ $booking->checkin_date }}<br>
Check Out: {{ $booking->checkout_date }}
</p>

@if($booking->roomUnit)
<p>
Assigned Room:
<strong>{{ $booking->roomUnit->room_number }}</strong>
</p>
@endif

<p>
We look forward to welcoming you.
</p>
<p>
    If you need to cancel your booking, please use this secure link:
</p>

<p>
    <a href="{{ URL::temporarySignedRoute('booking.cancel.show', now()->addDays(30), $booking) }}">
        Cancel Booking
    </a>
</p>
<p>
Poolside Villa Team
</p>
