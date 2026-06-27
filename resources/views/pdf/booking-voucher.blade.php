<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Booking Voucher</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; color: #111827; }
        .header { background: #020617; color: white; padding: 24px; border-radius: 12px; }
        .title { font-size: 26px; font-weight: bold; margin: 0; }
        .sub { margin-top: 6px; color: #cbd5e1; }
        .box { border: 1px solid #e5e7eb; padding: 18px; border-radius: 12px; margin-top: 18px; }
        .row { margin-bottom: 10px; }
        .label { color: #6b7280; font-size: 12px; text-transform: uppercase; }
        .value { font-size: 15px; font-weight: bold; }
        .total { font-size: 24px; color: #1d4ed8; font-weight: bold; }
        .footer { margin-top: 30px; font-size: 12px; color: #6b7280; }
    </style>
</head>
<body>

<div class="header">
    <p class="title">Poolside Villa Guest House</p>
    <p class="sub">Reservation Voucher</p>
</div>

<div class="box">
    <div class="row">
        <div class="label">Booking Reference</div>
        <div class="value">{{ $booking->booking_reference }}</div>
    </div>

    <div class="row">
        <div class="label">Guest Name</div>
        <div class="value">{{ $booking->guest_name }}</div>
    </div>

    <div class="row">
        <div class="label">Room Type</div>
        <div class="value">{{ $booking->roomType->name }}</div>
    </div>

    @if($booking->roomUnit)
        <div class="row">
            <div class="label">Assigned Room</div>
            <div class="value">Room {{ $booking->roomUnit->room_number }}</div>
        </div>
    @endif

    <div class="row">
        <div class="label">Check-in</div>
        <div class="value">{{ $booking->checkin_date }}</div>
    </div>

    <div class="row">
        <div class="label">Check-out</div>
        <div class="value">{{ $booking->checkout_date }}</div>
    </div>

    <div class="row">
        <div class="label">Guests</div>
        <div class="value">{{ $booking->adults }} adult(s), {{ $booking->children }} child(ren)</div>
    </div>

    <div class="row">
        <div class="label">Total Amount</div>
        <div class="total">${{ number_format($booking->total_amount, 2) }}</div>
    </div>

    <div class="row">
        <div class="label">Payment</div>
        <div class="value">Payment is made in person at the hotel.</div>
    </div>
</div>

<div class="footer">
    Please present this voucher at reception. This voucher confirms your reservation details.
</div>

</body>
</html>
