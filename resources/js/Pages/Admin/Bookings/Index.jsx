import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function BookingsIndex({ auth, bookings, roomUnits }) {
    const [selectedRooms, setSelectedRooms] = useState({});
    const [search, setSearch] = useState('');
    const [bookingStatus, setBookingStatus] = useState('all');
    const [stayStatus, setStayStatus] = useState('all');

    const filteredBookings = useMemo(() => {
        return bookings.filter((booking) => {
            const keyword = search.toLowerCase();

            const matchesSearch =
                booking.booking_reference?.toLowerCase().includes(keyword) ||
                booking.guest_name?.toLowerCase().includes(keyword) ||
                booking.guest_email?.toLowerCase().includes(keyword) ||
                booking.guest_phone?.toLowerCase().includes(keyword);

            const matchesBookingStatus =
                bookingStatus === 'all' || booking.status === bookingStatus;

            const matchesStayStatus =
                stayStatus === 'all' || booking.stay_status === stayStatus;

            return matchesSearch && matchesBookingStatus && matchesStayStatus;
        });
    }, [bookings, search, bookingStatus, stayStatus]);

    function updateStatus(bookingId, status) {
        router.patch(route('admin.bookings.status', bookingId), { status });
    }

    function updatePayment(bookingId, paymentStatus, amountPaid) {
        router.patch(
            route('admin.bookings.payment', bookingId),
            {
                payment_status: paymentStatus,
                amount_paid: amountPaid,
            },
            { preserveScroll: true },
        );
    }

    function assignRoom(bookingId) {
        const roomUnitId = selectedRooms[bookingId];

        if (!roomUnitId) {
            alert('Select a room number first.');
            return;
        }

        router.patch(route('admin.bookings.assign-room', bookingId), {
            room_unit_id: roomUnitId,
        });
    }

    function checkIn(bookingId) {
        router.patch(route('admin.bookings.check-in', bookingId));
    }

    function checkOut(bookingId) {
        router.patch(route('admin.bookings.check-out', bookingId));
    }

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Bookings" />

            <main className="min-h-screen bg-slate-100 px-4 py-6">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-950 p-5 text-white">
                        <div>
                            <h1 className="text-2xl font-black">Bookings</h1>
                            <p className="text-sm text-slate-300">
                                Search bookings, update payments, assign rooms,
                                check guests in, and check them out.
                            </p>
                        </div>

                        <Link
                            href={route('admin.walk-in-bookings.create')}
                            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white hover:bg-blue-500"
                        >
                            + Add Walk-in Booking
                        </Link>
                    </div>

                    <div className="mb-5 grid gap-3 rounded-2xl bg-white p-4 shadow-sm md:grid-cols-3">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search guest, phone, email, reference..."
                            className="rounded-xl border-slate-200 text-sm"
                        />

                        <select
                            value={bookingStatus}
                            onChange={(e) => setBookingStatus(e.target.value)}
                            className="rounded-xl border-slate-200 text-sm"
                        >
                            <option value="all">All booking statuses</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>

                        <select
                            value={stayStatus}
                            onChange={(e) => setStayStatus(e.target.value)}
                            className="rounded-xl border-slate-200 text-sm"
                        >
                            <option value="all">All stay statuses</option>
                            <option value="not_checked_in">Not checked in</option>
                            <option value="checked_in">Occupied</option>
                            <option value="checked_out">Checked out</option>
                        </select>
                    </div>

                    <div className="space-y-4">
                        {filteredBookings.length > 0 ? (
                            filteredBookings.map((booking) => {
                                const availableUnits = roomUnits.filter(
                                    (unit) =>
                                        unit.room_type_id === booking.room_type_id,
                                );

                                const balance =
                                    Number(booking.total_amount) -
                                    Number(booking.amount_paid || 0);

                                return (
                                    <div
                                        key={booking.id}
                                        className="rounded-2xl bg-white p-5 shadow-sm"
                                    >
                                        <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr_1fr]">
                                            <div>
                                                <p className="text-xs font-bold uppercase text-slate-500">
                                                    Booking
                                                </p>

                                                <h2 className="mt-1 text-xl font-black text-slate-950">
                                                    {booking.booking_reference}
                                                </h2>

                                                <p className="mt-3 font-bold text-slate-900">
                                                    {booking.guest_name}
                                                </p>
                                                <p className="text-sm text-slate-500">
                                                    {booking.guest_email || 'No email'}
                                                </p>
                                                <p className="text-sm text-slate-500">
                                                    {booking.guest_phone}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs font-bold uppercase text-slate-500">
                                                    Stay
                                                </p>

                                                <p className="mt-1 font-black text-slate-950">
                                                    {booking.room_type?.name || '—'}
                                                </p>

                                                <p className="mt-2 text-sm text-slate-600">
                                                    {booking.checkin_date} →{' '}
                                                    {booking.checkout_date}
                                                </p>

                                                <p className="mt-2 text-sm text-slate-600">
                                                    {booking.adults} adult(s),{' '}
                                                    {booking.children} child(ren)
                                                </p>

                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    <StatusBadge
                                                        status={booking.status}
                                                    />
                                                    <StayBadge
                                                        status={
                                                            booking.stay_status
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <p className="text-xs font-bold uppercase text-slate-500">
                                                    Assigned Room
                                                </p>

                                                <p className="mt-1 font-black text-slate-950">
                                                    {booking.room_unit
                                                        ? `Room ${booking.room_unit.room_number}`
                                                        : 'Not assigned'}
                                                </p>

                                                <div className="mt-3 flex gap-2">
                                                    <select
                                                        value={
                                                            selectedRooms[
                                                                booking.id
                                                            ] || ''
                                                        }
                                                        onChange={(e) =>
                                                            setSelectedRooms({
                                                                ...selectedRooms,
                                                                [booking.id]:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }
                                                        className="w-full rounded-xl border-slate-200 text-sm"
                                                    >
                                                        <option value="">
                                                            Select room
                                                        </option>

                                                        {availableUnits.map(
                                                            (unit) => (
                                                                <option
                                                                    key={
                                                                        unit.id
                                                                    }
                                                                    value={
                                                                        unit.id
                                                                    }
                                                                >
                                                                    Room{' '}
                                                                    {
                                                                        unit.room_number
                                                                    }
                                                                </option>
                                                            ),
                                                        )}
                                                    </select>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            assignRoom(
                                                                booking.id,
                                                            )
                                                        }
                                                        className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white hover:bg-blue-800"
                                                    >
                                                        Assign
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-5 grid gap-4 rounded-2xl bg-slate-50 p-4 md:grid-cols-4">
                                            <div>
                                                <p className="text-xs font-bold uppercase text-slate-500">
                                                    Total
                                                </p>
                                                <p className="text-lg font-black text-slate-950">
                                                    $
                                                    {Number(
                                                        booking.total_amount,
                                                    ).toFixed(2)}
                                                </p>
                                            </div>

                                            <PaymentEditor
                                                booking={booking}
                                                onSave={updatePayment}
                                            />

                                            <div>
                                                <p className="text-xs font-bold uppercase text-slate-500">
                                                    Balance
                                                </p>
                                                <p
                                                    className={
                                                        balance <= 0
                                                            ? 'text-lg font-black text-green-700'
                                                            : 'text-lg font-black text-red-700'
                                                    }
                                                >
                                                    ${balance.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                                            {booking.status !== 'confirmed' && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        updateStatus(
                                                            booking.id,
                                                            'confirmed',
                                                        )
                                                    }
                                                    className="rounded-lg bg-green-700 px-3 py-2 text-xs font-bold text-white hover:bg-green-800"
                                                >
                                                    Confirm Booking
                                                </button>
                                            )}

                                            {booking.status !== 'cancelled' && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        updateStatus(
                                                            booking.id,
                                                            'cancelled',
                                                        )
                                                    }
                                                    className="rounded-lg bg-red-700 px-3 py-2 text-xs font-bold text-white hover:bg-red-800"
                                                >
                                                    Cancel Booking
                                                </button>
                                            )}

                                            {booking.stay_status !==
                                                'checked_in' &&
                                                booking.stay_status !==
                                                    'checked_out' && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            checkIn(booking.id)
                                                        }
                                                        className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-black"
                                                    >
                                                        Check In / Mark Occupied
                                                    </button>
                                                )}

                                            {booking.stay_status ===
                                                'checked_in' && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        checkOut(booking.id)
                                                    }
                                                    className="rounded-lg bg-amber-600 px-3 py-2 text-xs font-bold text-white hover:bg-amber-700"
                                                >
                                                    Check Out / Free Room
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="rounded-2xl bg-white p-10 text-center text-slate-500 shadow-sm">
                                No bookings found.
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </AuthenticatedLayout>
    );
}

function PaymentEditor({ booking, onSave }) {
    const [paymentStatus, setPaymentStatus] = useState(
        booking.payment_status || 'pending',
    );
    const [amountPaid, setAmountPaid] = useState(booking.amount_paid || 0);

    return (
        <>
            <div>
                <p className="text-xs font-bold uppercase text-slate-500">
                    Payment Status
                </p>
                <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className="mt-1 w-full rounded-xl border-slate-200 text-sm"
                >
                    <option value="pending">Pending</option>
                    <option value="partially_paid">Partially Paid</option>
                    <option value="paid">Paid</option>
                    <option value="refunded">Refunded</option>
                </select>
            </div>

            <div>
                <p className="text-xs font-bold uppercase text-slate-500">
                    Amount Paid
                </p>

                <div className="mt-1 flex gap-2">
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={amountPaid}
                        onChange={(e) => setAmountPaid(e.target.value)}
                        className="w-full rounded-xl border-slate-200 text-sm"
                    />

                    <button
                        type="button"
                        onClick={() =>
                            onSave(booking.id, paymentStatus, amountPaid)
                        }
                        className="rounded-xl bg-blue-700 px-3 py-2 text-xs font-bold text-white hover:bg-blue-800"
                    >
                        Save
                    </button>
                </div>
                <details className="mt-3 rounded-2xl border border-slate-200 bg-slate-50">
    <summary className="cursor-pointer px-4 py-3 text-sm font-black text-slate-700 hover:bg-slate-100">
        Activity Timeline ({booking.activity_logs?.length || 0})
    </summary>

    <div className="border-t border-slate-200 p-3">
        {booking.activity_logs?.length > 0 ? (
            <div className="space-y-2">
                {booking.activity_logs.map((log) => (
                    <div
                        key={log.id}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2"
                    >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-sm font-bold capitalize text-slate-900">
                                {log.action.replaceAll('_', ' ')}
                            </span>

                            <span className="text-xs text-slate-500">
                                {new Date(log.created_at).toLocaleString()}
                            </span>
                        </div>

                        {log.description && (
                            <p className="text-xs text-slate-600">
                                {log.description}
                            </p>
                        )}

                        {log.user && (
                            <p className="text-xs text-slate-400">
                                By: {log.user.name}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        ) : (
            <p className="rounded-lg bg-white px-3 py-2 text-sm text-slate-500">
                No activity yet.
            </p>
        )}
    </div>
</details>
            </div>
        </>
    );
}

function StatusBadge({ status }) {
    const styles = {
        pending: 'bg-yellow-100 text-yellow-700',
        confirmed: 'bg-green-100 text-green-700',
        cancelled: 'bg-red-100 text-red-700',
    };

    return (
        <span
            className={`rounded-full px-3 py-1 text-xs font-black uppercase ${
                styles[status] || 'bg-slate-100 text-slate-700'
            }`}
        >
            {status}
        </span>
    );
}

function StayBadge({ status }) {
    const labels = {
        not_checked_in: 'Not checked in',
        checked_in: 'Occupied',
        checked_out: 'Checked out',
    };

    const styles = {
        not_checked_in: 'bg-slate-100 text-slate-700',
        checked_in: 'bg-blue-100 text-blue-700',
        checked_out: 'bg-green-100 text-green-700',
    };

    return (
        <span
            className={`rounded-full px-3 py-1 text-xs font-black uppercase ${
                styles[status] || 'bg-slate-100 text-slate-700'
            }`}
        >
            {labels[status] || status}
        </span>
    );
}
