<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\RoomType;
use App\Models\RoomUnit;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        $totalRooms = RoomUnit::where('status', 'active')->count();

        $occupiedRooms = Booking::where('stay_status', 'checked_in')->count();

        $occupancyRate = $totalRooms > 0
            ? round(($occupiedRooms / $totalRooms) * 100, 1)
            : 0;

        $todayRevenue = Booking::whereDate('created_at', today())
            ->whereIn('payment_status', ['paid', 'partially_paid'])
            ->sum('amount_paid');

        $monthlyRevenue = Booking::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->whereIn('payment_status', ['paid', 'partially_paid'])
            ->sum('amount_paid');

        $popularRoomTypes = RoomType::withCount('bookings')
            ->orderByDesc('bookings_count')
            ->limit(5)
            ->get();

        $topGuests = Booking::selectRaw('
                COALESCE(guest_email, guest_phone) as guest_key,
                guest_name,
                guest_email,
                guest_phone,
                COUNT(*) as total_stays,
                SUM(total_amount) as total_spent
            ')
            ->groupBy('guest_key', 'guest_name', 'guest_email', 'guest_phone')
            ->orderByDesc('total_spent')
            ->limit(10)
            ->get();

        return Inertia::render('Admin/Reports/Index', [
            'stats' => [
                'totalRooms' => $totalRooms,
                'occupiedRooms' => $occupiedRooms,
                'occupancyRate' => $occupancyRate,
                'todayRevenue' => $todayRevenue,
                'monthlyRevenue' => $monthlyRevenue,
                'totalBookings' => Booking::count(),
                'confirmedBookings' => Booking::where('status', 'confirmed')->count(),
            ],
            'popularRoomTypes' => $popularRoomTypes,
            'topGuests' => $topGuests,
        ]);
    }
}
