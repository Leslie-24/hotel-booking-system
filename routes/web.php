<?php

use App\Http\Controllers\Admin\AvailabilityController;
use App\Http\Controllers\Admin\BookingController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\RoomPhotoController;
use App\Http\Controllers\Admin\RoomTypeController;
use App\Http\Controllers\Admin\RoomUnitController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PublicBookingController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PublicBookingController::class, 'home'])->name('home');
Route::get('/rooms', [PublicBookingController::class, 'rooms'])->name('rooms');

Route::get('/booking', [PublicBookingController::class, 'search'])->name('booking.search');
Route::get('/booking/confirm', [PublicBookingController::class, 'confirm'])->name('booking.confirm');
Route::post('/booking', [PublicBookingController::class, 'store'])->name('booking.store');
Route::get('/booking/success/{booking}', [PublicBookingController::class, 'success'])->name('booking.success');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::prefix('admin')->name('admin.')->group(function () {
        Route::resource('room-types', RoomTypeController::class)
            ->middleware('role:admin');

        Route::resource('users', UserController::class)
            ->middleware('role:admin');

        Route::post('room-units', [RoomUnitController::class, 'store'])
            ->middleware('role:admin')
            ->name('room-units.store');

        Route::patch('room-units/{roomUnit}', [RoomUnitController::class, 'update'])
            ->middleware('role:admin')
            ->name('room-units.update');

        Route::delete('room-units/{roomUnit}', [RoomUnitController::class, 'destroy'])
            ->middleware('role:admin')
            ->name('room-units.destroy');

        Route::patch('room-type-photos/{photo}/primary', [RoomPhotoController::class, 'makePrimary'])
            ->middleware('role:admin')
            ->name('room-type-photos.primary');

        Route::delete('room-type-photos/{photo}', [RoomPhotoController::class, 'destroy'])
            ->middleware('role:admin')
            ->name('room-type-photos.destroy');

        Route::get('availability', [AvailabilityController::class, 'index'])
            ->middleware('role:admin,receptionist')
            ->name('availability.index');

        Route::post('availability', [AvailabilityController::class, 'store'])
            ->middleware('role:admin,receptionist')
            ->name('availability.store');

        Route::delete('availability/{availability}', [AvailabilityController::class, 'destroy'])
            ->middleware('role:admin,receptionist')
            ->name('availability.destroy');

        Route::get('bookings', [BookingController::class, 'index'])
            ->middleware('role:admin,receptionist')
            ->name('bookings.index');

        Route::patch('bookings/{booking}/status', [BookingController::class, 'updateStatus'])
            ->middleware('role:admin,receptionist')
            ->name('bookings.status');

        Route::patch('bookings/{booking}/assign-room', [BookingController::class, 'assignRoom'])
            ->middleware('role:admin,receptionist')
            ->name('bookings.assign-room');

        Route::patch('bookings/{booking}/check-in', [BookingController::class, 'checkIn'])
            ->middleware('role:admin,receptionist')
            ->name('bookings.check-in');

        Route::patch('bookings/{booking}/check-out', [BookingController::class, 'checkOut'])
            ->middleware('role:admin,receptionist')
            ->name('bookings.check-out');
            Route::get('walk-in-bookings/create', [\App\Http\Controllers\Admin\WalkInBookingController::class, 'create'])
    ->middleware('role:admin,receptionist')
    ->name('walk-in-bookings.create');

Route::post('walk-in-bookings', [\App\Http\Controllers\Admin\WalkInBookingController::class, 'store'])
    ->middleware('role:admin,receptionist')
    ->name('walk-in-bookings.store');
    Route::get(
    'bookings/{booking}/voucher',
    [\App\Http\Controllers\Admin\VoucherController::class, 'download']
)->middleware('role:admin,receptionist')
 ->name('bookings.voucher');
 Route::patch('bookings/{booking}/payment', [BookingController::class, 'updatePayment'])
    ->middleware('role:admin,receptionist')
    ->name('bookings.payment');
    Route::get('guests', [\App\Http\Controllers\Admin\GuestController::class, 'index'])
    ->middleware('role:admin,receptionist,manager')
    ->name('guests.index');
    Route::get('reports/bookings/export/pdf', [\App\Http\Controllers\Admin\ExportController::class, 'bookingsPdf'])
    ->middleware('role:admin,manager')
    ->name('reports.bookings.pdf');
    Route::get('reports', [\App\Http\Controllers\Admin\ReportController::class, 'index'])
    ->middleware('role:admin,manager')
    ->name('reports.index');
    Route::get('reports/bookings/export/excel', [\App\Http\Controllers\Admin\ExportController::class, 'bookingsExcel'])
    ->middleware('role:admin,manager')
    ->name('reports.bookings.excel');
    Route::get('reports/revenue/export/excel', [\App\Http\Controllers\Admin\ExportController::class, 'revenueExcel'])
    ->middleware('role:admin,manager')
    ->name('reports.revenue.excel');
    Route::get('calendar', [\App\Http\Controllers\Admin\CalendarController::class, 'index'])
    ->middleware('role:admin,receptionist,manager')
    ->name('calendar.index');
    });
});
Route::get('reports', [\App\Http\Controllers\Admin\ReportController::class, 'index'])
    ->middleware('role:admin,manager')
    ->name('reports.index');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
Route::get('/booking/cancel/{booking}', [\App\Http\Controllers\PublicBookingCancellationController::class, 'show'])
    ->middleware('signed')
    ->name('booking.cancel.show');

Route::post('/booking/cancel/{booking}', [\App\Http\Controllers\PublicBookingCancellationController::class, 'cancel'])
    ->middleware('signed')
    ->name('booking.cancel');
    Route::get('/booking/manage', [\App\Http\Controllers\PublicBookingLookupController::class, 'index'])
    ->name('booking.manage');

Route::post('/booking/manage', [\App\Http\Controllers\PublicBookingLookupController::class, 'lookup'])
    ->name('booking.lookup');

Route::post('/booking/manage/cancel', [\App\Http\Controllers\PublicBookingLookupController::class, 'cancel'])
    ->name('booking.lookup.cancel');
require __DIR__.'/auth.php';
