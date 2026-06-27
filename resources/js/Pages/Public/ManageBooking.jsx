import { Head, Link, router, useForm } from '@inertiajs/react';

export default function ManageBooking({ booking, errors }) {
    const { data, setData, post, processing } = useForm({
        booking_reference: booking?.booking_reference || '',
        guest_phone: booking?.guest_phone || '',
    });

    function lookup(e) {
        e.preventDefault();
        post(route('booking.lookup'));
    }

    function cancelBooking() {
        if (!confirm('Cancel this booking?')) return;

        router.post(route('booking.lookup.cancel'), {
            booking_reference: data.booking_reference,
            guest_phone: data.guest_phone,
        });
    }

    return (
        <>
            <Head title="Manage Booking" />

            <main className="min-h-screen bg-slate-100 px-5 py-10">
                <div className="mx-auto max-w-2xl">
                    <Link href="/" className="text-sm font-bold text-blue-700">
                        ← Back to Home
                    </Link>

                    <div className="mt-5 rounded-3xl bg-white p-7 shadow-sm">
                        <h1 className="text-2xl font-black text-slate-950">
                            Manage Booking
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Enter your booking reference and phone number to view or cancel your booking.
                        </p>

                        <form onSubmit={lookup} className="mt-6 grid gap-4 md:grid-cols-2">
                            <Input
                                label="Booking Reference"
                                value={data.booking_reference}
                                error={errors?.booking_reference}
                                onChange={(e) =>
                                    setData('booking_reference', e.target.value)
                                }
                            />

                            <Input
                                label="Phone Number"
                                value={data.guest_phone}
                                error={errors?.guest_phone}
                                onChange={(e) =>
                                    setData('guest_phone', e.target.value)
                                }
                            />

                            <button
                                disabled={processing}
                                className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white hover:bg-blue-800 md:col-span-2"
                            >
                                {processing ? 'Searching...' : 'Find Booking'}
                            </button>
                        </form>

                        {booking && (
                            <div className="mt-7 rounded-2xl bg-slate-50 p-5">
                                <h2 className="text-lg font-black text-slate-950">
                                    Booking Details
                                </h2>

                                <div className="mt-4 text-sm">
                                    <Row label="Reference" value={booking.booking_reference} />
                                    <Row label="Guest" value={booking.guest_name} />
                                    <Row label="Room Type" value={booking.room_type?.name || '—'} />
                                    <Row label="Check-in" value={booking.checkin_date} />
                                    <Row label="Check-out" value={booking.checkout_date} />
                                    <Row label="Status" value={booking.status} />
                                </div>

                                {booking.status !== 'cancelled' &&
                                    booking.stay_status !== 'checked_in' && (
                                        <button
                                            type="button"
                                            onClick={cancelBooking}
                                            className="mt-5 w-full rounded-xl bg-red-700 px-5 py-3 text-sm font-black text-white hover:bg-red-800"
                                        >
                                            Cancel Booking
                                        </button>
                                    )}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}

function Input({ label, value, onChange, error }) {
    return (
        <label>
            <span className="text-sm font-bold text-slate-700">{label}</span>
            <input
                type="text"
                value={value}
                onChange={onChange}
                className="mt-1 w-full rounded-xl border-slate-200 text-sm"
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </label>
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
