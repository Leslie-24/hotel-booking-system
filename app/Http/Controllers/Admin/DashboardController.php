<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Room;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
{
    $occupiedRooms = \App\Models\Booking::where(
        'stay_status',
        'checked_in'
    )->count();

    $availableRooms = \App\Models\RoomUnit::where('status', 'active')
        ->whereDoesntHave('bookings', function ($query) {
            $query->where('stay_status', 'checked_in');
        })
        ->count();

    $todayCheckIns = \App\Models\Booking::whereDate(
        'checkin_date',
        today()
    )->count();

    $todayCheckOuts = \App\Models\Booking::whereDate(
        'checkout_date',
        today()
    )->count();

    $monthlyRevenue = \App\Models\Booking::where(
        'status',
        'confirmed'
    )
        ->whereMonth('created_at', now()->month)
        ->sum('total_amount');

    return \Inertia\Inertia::render('Admin/Dashboard', [
        'stats' => [
            'bookings' => \App\Models\Booking::count(),
            'occupiedRooms' => $occupiedRooms,
            'availableRooms' => $availableRooms,
            'todayCheckIns' => $todayCheckIns,
            'todayCheckOuts' => $todayCheckOuts,
            'monthlyRevenue' => $monthlyRevenue,
            'pendingBookings' => \App\Models\Booking::where(
                'status',
                'pending'
            )->count(),
        ],
    ]);
}
}
