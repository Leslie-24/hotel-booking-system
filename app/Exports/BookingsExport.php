<?php

namespace App\Exports;

use App\Models\Booking;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class BookingsExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return Booking::with(['roomType', 'roomUnit'])
            ->latest()
            ->get();
    }

    public function headings(): array
    {
        return [
            'Reference',
            'Guest Name',
            'Email',
            'Phone',
            'Room Type',
            'Assigned Room',
            'Check-in',
            'Check-out',
            'Adults',
            'Children',
            'Booking Status',
            'Stay Status',
            'Payment Status',
            'Total Amount',
            'Amount Paid',
            'Balance',
        ];
    }

    public function map($booking): array
    {
        return [
            $booking->booking_reference,
            $booking->guest_name,
            $booking->guest_email,
            $booking->guest_phone,
            $booking->roomType?->name,
            $booking->roomUnit ? 'Room ' . $booking->roomUnit->room_number : 'Not assigned',
            $booking->checkin_date,
            $booking->checkout_date,
            $booking->adults,
            $booking->children,
            $booking->status,
            $booking->stay_status,
            $booking->payment_status,
            $booking->total_amount,
            $booking->amount_paid,
            $booking->total_amount - $booking->amount_paid,
        ];
    }
}
