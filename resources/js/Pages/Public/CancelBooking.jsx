import { Head, router } from '@inertiajs/react';

export default function CancelBooking({ booking, errors }) {
    function cancelBooking() {
        if (!confirm('Cancel this booking?')) return;

        router.post(window.location.href);
    }

    return (
        <>
            <Head title="Cancel Booking" />

            <main className="min-h-screen bg-slate-100 px-5 py-10">
                <div className="mx-auto max-w-xl rounded-3xl bg-white p-7 shadow-sm">
                    <h1 className="text-2xl font-black text-slate-950">
                        Cancel Booking
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Please confirm that you want to cancel this reservation.
                    </p>

                    {errors?.booking && (
                        <p className="mt-4 rounded-xl bg-red-100 p-3 text-sm font-bold text-red-700">
                            {errors.booking}
                        </p>
                    )}

                    <div className="mt-6 rounded-2xl bg-slate-50 p-5 text-sm">
                        <Row label="Reference" value={booking.booking_reference} />
                        <Row label="Guest" value={booking.guest_name} />
                        <Row label="Room Type" value={booking.room_type?.name || '—'} />
                        <Row label="Check-in" value={booking.checkin_date} />
                        <Row label="Check-out" value={booking.checkout_date} />
                        <Row label="Status" value={booking.status} />
                    </div>

                    <button
                        type="button"
                        onClick={cancelBooking}
                        className="mt-6 w-full rounded-full bg-red-700 px-6 py-3 text-sm font-black text-white hover:bg-red-800"
                    >
                        Confirm Cancellation
                    </button>
                </div>
            </main>
        </>
    );
}

function Row({ label, value }) {
    return (
        <div className="flex justify-between border-b border-slate-200 py-3 last:border-b-0">
            <span className="font-bold text-slate-500">{label}</span>
            <span className="font-black text-slate-900">{value}</span>
        </div>
    );
}
