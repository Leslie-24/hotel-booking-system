<?php

namespace App\Exports;

use App\Models\Booking;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class RevenueExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return Booking::with(['roomType', 'roomUnit'])
            ->whereIn('payment_status', ['paid', 'partially_paid'])
            ->latest()
            ->get();
    }

    public function headings(): array
    {
        return [
            'Reference',
            'Guest Name',
            'Room Type',
            'Check-in',
            'Check-out',
            'Payment Status',
            'Total Amount',
            'Amount Paid',
            'Balance',
            'Created At',
        ];
    }

    public function map($booking): array
    {
        return [
            $booking->booking_reference,
            $booking->guest_name,
            $booking->roomType?->name,
            $booking->checkin_date,
            $booking->checkout_date,
            $booking->payment_status,
            $booking->total_amount,
            $booking->amount_paid,
            $booking->total_amount - $booking->amount_paid,
            $booking->created_at,
        ];
    }
}
