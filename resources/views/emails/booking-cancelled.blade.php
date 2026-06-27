<h2>Booking Cancelled</h2>

<p>Dear {{ $booking->guest_name }},</p>

<p>
Your booking at Poolside Villa has been cancelled.
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

<p>
If this was unexpected, please contact the hotel directly.
</p>

<p>
Poolside Villa Team
</p>
