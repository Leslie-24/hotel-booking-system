<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Bookings Report</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color: #111827; }
        h1 { margin-bottom: 4px; }
        .muted { color: #6b7280; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #020617; color: white; padding: 8px; text-align: left; }
        td { border-bottom: 1px solid #e5e7eb; padding: 8px; }
    </style>
</head>
<body>
    <h1>Poolside Villa - Bookings Report</h1>
    <p class="muted">Generated on {{ now()->format('Y-m-d H:i') }}</p>

    <table>
        <thead>
            <tr>
                <th>Reference</th>
                <th>Guest</th>
                <th>Room Type</th>
                <th>Room</th>
                <th>Dates</th>
                <th>Status</th>
                <th>Total</th>
                <th>Paid</th>
            </tr>
        </thead>
        <tbody>
            @foreach($bookings as $booking)
                <tr>
                    <td>{{ $booking->booking_reference }}</td>
                    <td>{{ $booking->guest_name }}</td>
                    <td>{{ $booking->roomType->name ?? '-' }}</td>
                    <td>{{ $booking->roomUnit ? 'Room '.$booking->roomUnit->room_number : '-' }}</td>
                    <td>{{ $booking->checkin_date }} to {{ $booking->checkout_date }}</td>
                    <td>{{ $booking->status }}</td>
                    <td>${{ number_format($booking->total_amount, 2) }}</td>
                    <td>${{ number_format($booking->amount_paid, 2) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
