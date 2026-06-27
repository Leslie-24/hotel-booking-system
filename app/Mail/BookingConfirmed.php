<?php

namespace App\Mail;

use App\Models\Booking;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class BookingConfirmed extends Mailable
{
    use Queueable, SerializesModels;

    public Booking $booking;

    public function __construct(Booking $booking)
    {
        $this->booking = $booking;
    }

    public function build()
    {
        $pdf = Pdf::loadView('pdf.booking-voucher', [
            'booking' => $this->booking,
        ]);

        return $this->subject('Booking Confirmed')
            ->view('emails.booking-confirmed')
            ->attachData(
                $pdf->output(),
                'PoolsideVilla-Voucher-' . $this->booking->booking_reference . '.pdf',
                ['mime' => 'application/pdf']
            );
    }
}
