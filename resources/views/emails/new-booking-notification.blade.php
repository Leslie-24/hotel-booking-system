<h2>New Booking Request</h2>

<p>A new booking request has been submitted.</p>

<p><strong>Reference:</strong> {{ $booking->booking_reference }}</p>
<p><strong>Guest:</strong> {{ $booking->guest_name }}</p>
<p><strong>Email:</strong> {{ $booking->guest_email }}</p>
<p><strong>Phone:</strong> {{ $booking->guest_phone }}</p>
<p><strong>Room Type:</strong> {{ $booking->roomType->name }}</p>
<p><strong>Check In:</strong> {{ $booking->checkin_date }}</p>
<p><strong>Check Out:</strong> {{ $booking->checkout_date }}</p>
<p><strong>Total:</strong> ${{ number_format($booking->total_amount, 2) }}</p>

@if($booking->special_request)
<p><strong>Special Request:</strong> {{ $booking->special_request }}</p>
@endif
