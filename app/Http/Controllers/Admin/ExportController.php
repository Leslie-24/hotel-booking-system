<?php

namespace App\Http\Controllers\Admin;

use App\Exports\BookingsExport;
use App\Exports\RevenueExport;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;

class ExportController extends Controller
{
    public function bookingsPdf()
    {
        $bookings = Booking::with(['roomType', 'roomUnit'])
            ->latest()
            ->get();

        $pdf = Pdf::loadView('pdf.bookings-report', [
            'bookings' => $bookings,
        ]);

        return $pdf->download('bookings-report.pdf');
    }

    public function bookingsExcel()
    {
        return Excel::download(
            new BookingsExport(),
            'bookings-report.xlsx'
        );
    }
    public function revenueExcel()
{
    return Excel::download(
        new RevenueExport(),
        'revenue-report.xlsx'
    );
}
}
