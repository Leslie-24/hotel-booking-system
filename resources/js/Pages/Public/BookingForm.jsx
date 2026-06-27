import { Head, Link, useForm } from '@inertiajs/react';

export default function BookingForm({ room, filters }) {
    const { data, setData, post, processing, errors } = useForm({
        room_type_id: room.id,
        checkin: filters.checkin,
        checkout: filters.checkout,
        adults: filters.adults,
        children: filters.children || 0,
        guest_name: '',
        guest_email: '',
        guest_phone: '',
        special_request: '',
    });

    function submit(e) {
        e.preventDefault();
        post('/booking');
    }

    return (
        <>
            <Head title="Complete Booking" />

            <main className="min-h-screen bg-slate-100 px-5 py-8">
                <div className="mx-auto max-w-5xl">
                    <Link href="/booking" className="text-sm font-bold text-blue-700">
                        ← Back to rooms
                    </Link>

                    <div className="mt-5 grid gap-5 md:grid-cols-[1fr_380px]">
                        <form
                            onSubmit={submit}
                            className="rounded-3xl bg-white p-6 shadow-sm"
                        >
                            <h1 className="text-2xl font-black text-slate-950">
                                Guest Details
                            </h1>

                            <p className="mt-1 text-sm text-slate-500">
                                Fill in your details to request this booking.
                            </p>

                            {errors.room_type_id && (
                                <p className="mt-4 rounded-xl bg-red-100 p-3 text-sm font-bold text-red-700">
                                    {errors.room_type_id}
                                </p>
                            )}

                            <div className="mt-6 grid gap-4 md:grid-cols-2">
                                <Input
                                    label="Full Name"
                                    value={data.guest_name}
                                    error={errors.guest_name}
                                    onChange={(e) =>
                                        setData('guest_name', e.target.value)
                                    }
                                />

                                <Input
                                    label="Email"
                                    type="email"
                                    value={data.guest_email}
                                    error={errors.guest_email}
                                    onChange={(e) =>
                                        setData('guest_email', e.target.value)
                                    }
                                />

                                <Input
                                    label="Phone"
                                    value={data.guest_phone}
                                    error={errors.guest_phone}
                                    onChange={(e) =>
                                        setData('guest_phone', e.target.value)
                                    }
                                />

                                <label className="block md:col-span-2">
                                    <span className="text-sm font-bold text-slate-700">
                                        Special Request
                                    </span>

                                    <textarea
                                        rows="4"
                                        value={data.special_request}
                                        onChange={(e) =>
                                            setData(
                                                'special_request',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 w-full rounded-xl border-slate-200 text-sm"
                                        placeholder="Arrival time, extra bed, airport pickup..."
                                    />

                                    {errors.special_request && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.special_request}
                                        </p>
                                    )}
                                </label>
                            </div>

                            <button
                                disabled={processing}
                                className="mt-6 rounded-full bg-blue-700 px-6 py-3 text-sm font-black text-white hover:bg-blue-800 disabled:opacity-60"
                            >
                                {processing
                                    ? 'Submitting...'
                                    : 'Submit Booking Request'}
                            </button>
                        </form>

                        <aside className="rounded-3xl bg-slate-950 p-6 text-white shadow-sm">
                            <p className="text-sm font-bold uppercase tracking-wide text-blue-200">
                                Booking Summary
                            </p>

                            {room.photos?.length > 0 && (
                                <img
                                    src={`/storage/${room.photos[0].image_path}`}
                                    alt={room.name}
                                    className="mt-4 h-44 w-full rounded-2xl object-cover"
                                />
                            )}

                            <h2 className="mt-4 text-2xl font-black">
                                {room.name}
                            </h2>

                            <p className="text-sm text-slate-300">
                                {room.total_rooms} rooms in this category
                            </p>

                            <div className="mt-6 space-y-3 text-sm">
                                <Row label="Check-in" value={filters.checkin} />
                                <Row label="Check-out" value={filters.checkout} />
                                <Row label="Adults" value={filters.adults} />
                                <Row label="Children" value={filters.children || 0} />
                            </div>

                            <div className="mt-6 border-t border-white/10 pt-5">
                                <p className="text-sm text-slate-300">
                                    Total amount
                                </p>

                                <p className="text-4xl font-black">
                                    ${Number(room.total_amount).toFixed(2)}
                                </p>

                                <p className="mt-1 text-sm text-slate-400">
                                    Payment is made in person at the hotel.
                                </p>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
        </>
    );
}

function Input({ label, value, onChange, error, type = 'text' }) {
    return (
        <label className="block">
            <span className="text-sm font-bold text-slate-700">{label}</span>

            <input
                type={type}
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
        <div className="flex justify-between gap-4 border-b border-white/10 pb-2">
            <span className="text-slate-400">{label}</span>
            <strong>{value}</strong>
        </div>
    );
}
