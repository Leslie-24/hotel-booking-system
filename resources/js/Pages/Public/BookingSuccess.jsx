import { Head, Link } from '@inertiajs/react';

export default function BookingSuccess({ booking }) {
    return (
        <>
            <Head title="Booking Submitted" />

            <main className="min-h-screen bg-slate-100 px-5 py-10">
                <div className="mx-auto max-w-3xl">
                    <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
                            ✓
                        </div>

                        <h1 className="mt-5 text-3xl font-black text-slate-950">
                            Booking Request Submitted
                        </h1>

                        <p className="mt-2 text-slate-500">
                            Your booking has been received. The hotel will confirm availability and contact you shortly.
                        </p>

                        <div className="mt-6 rounded-2xl bg-slate-50 p-5 text-left">
                            <Row label="Reference" value={booking.booking_reference} />
                            <Row
    label="Room Type"
    value={booking.room_type?.name || '—'}
/>
                            <Row label="Guest" value={booking.guest_name} />
                            <Row label="Check-in" value={booking.checkin_date} />
                            <Row label="Check-out" value={booking.checkout_date} />
                            <Row label="Status" value={booking.status} />
                            <Row
                                label="Total"
                                value={`$${Number(booking.total_amount).toFixed(2)}`}
                            />
                        </div>

                        <Link
                            href="/"
                            className="mt-6 inline-block rounded-full bg-blue-700 px-6 py-3 text-sm font-black text-white hover:bg-blue-800"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </main>
        </>
    );
}

function Row({ label, value }) {
    return (
        <div className="flex justify-between gap-4 border-b border-slate-200 py-3 last:border-b-0">
            <span className="text-sm font-bold text-slate-500">{label}</span>
            <span className="text-right text-sm font-black text-slate-900">
                {value}
            </span>
        </div>
    );
}
