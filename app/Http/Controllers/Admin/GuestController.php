<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Inertia\Inertia;

class GuestController extends Controller
{
    public function index()
    {
        $guests = Booking::selectRaw('
                COALESCE(guest_email, guest_phone) as guest_key,
                guest_name,
                guest_email,
                guest_phone,
                COUNT(*) as total_stays,
                SUM(total_amount) as total_spent,
                MAX(checkout_date) as last_stay
            ')
            ->whereNotNull('guest_phone')
            ->groupBy('guest_key', 'guest_name', 'guest_email', 'guest_phone')
            ->orderByDesc('last_stay')
            ->get();

        return Inertia::render('Admin/Guests/Index', [
            'guests' => $guests,
        ]);
    }
}
