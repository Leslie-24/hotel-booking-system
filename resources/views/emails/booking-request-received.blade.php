<h2>Booking Request Received</h2>

<p>Dear {{ $booking->guest_name }},</p>

<p>
Thank you for choosing Poolside Villa.
Your booking request has been received and is awaiting confirmation.
</p>

<p>
Booking Reference:
<strong>{{ $booking->booking_reference }}</strong>
</p>

<p>
Check In: {{ $booking->checkin_date }}<br>
Check Out: {{ $booking->checkout_date }}
</p>

<p>
We will notify you once your reservation has been confirmed.
</p>
<p>
    If you need to cancel your booking, please use this secure link:
</p>

<p>
    <a href="{{ URL::temporarySignedRoute('booking.cancel.show', now()->addDays(30), $booking) }}">
        Cancel Booking
    </a>
</p>
<p>Poolside Villa Team</p>
