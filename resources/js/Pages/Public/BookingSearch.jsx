import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Wifi, Coffee, Waves, Car, Tv, Snowflake } from 'lucide-react';
const amenityMap = {
    wifi: { icon: Wifi, label: 'WiFi' },
    breakfast: { icon: Coffee, label: 'Breakfast' },
    pool: { icon: Waves, label: 'Pool Access' },
    parking: { icon: Car, label: 'Parking' },
    tv: { icon: Tv, label: 'Smart TV' },
    ac: { icon: Snowflake, label: 'Air Conditioning' },
};
export default function BookingSearch({ rooms, filters }) {
    const [form, setForm] = useState({
        checkin: filters.checkin || '',
        checkout: filters.checkout || '',
        adults: filters.adults || 2,
        children: filters.children || 0,
    });

    const [openRoom, setOpenRoom] = useState(null);

    function submit(e) {
        e.preventDefault();
        router.get('/booking', form, {
            preserveState: true,
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title="Check Availability" />

            <main className="min-h-screen bg-slate-100">
                <section className="bg-slate-950 px-5 py-6 text-white">
                    <div className="mx-auto flex max-w-6xl items-center justify-between">
                        <Link href="/" className="font-black">
                            Poolside Villa
                        </Link>
                        <Link
                            href="/login"
                            className="rounded-full border border-white/20 px-4 py-2 text-sm hover:bg-white hover:text-slate-950"
                        >
                            Staff Login
                        </Link>
                    </div>

                    <div className="mx-auto max-w-6xl py-10">
                        <p className="text-sm font-bold uppercase tracking-[0.3em] text-blue-200">
                            Booking Engine
                        </p>
                        <h1 className="mt-2 text-4xl font-black">
                            Find your perfect room
                        </h1>
                        <p className="mt-2 max-w-2xl text-slate-300">
                            Choose your dates and see available rooms instantly.
                        </p>
                    </div>
                </section>

                <section className="-mt-8 px-5">
                    <form
                        onSubmit={submit}
                        className="mx-auto grid max-w-6xl gap-3 rounded-2xl bg-white p-4 shadow-xl md:grid-cols-5"
                    >
                        <Field label="Check-in">
                            <input
                                type="date"
                                value={form.checkin}
                                onChange={(e) =>
                                    setForm({ ...form, checkin: e.target.value })
                                }
                                className="w-full rounded-xl border-slate-200 text-sm"
                                required
                            />
                        </Field>

                        <Field label="Check-out">
                            <input
                                type="date"
                                value={form.checkout}
                                onChange={(e) =>
                                    setForm({ ...form, checkout: e.target.value })
                                }
                                className="w-full rounded-xl border-slate-200 text-sm"
                                required
                            />
                        </Field>

                        <Field label="Adults">
                            <input
                                type="number"
                                min="1"
                                value={form.adults}
                                onChange={(e) =>
                                    setForm({ ...form, adults: e.target.value })
                                }
                                className="w-full rounded-xl border-slate-200 text-sm"
                            />
                        </Field>

                        <Field label="Children">
                            <input
                                type="number"
                                min="0"
                                value={form.children}
                                onChange={(e) =>
                                    setForm({ ...form, children: e.target.value })
                                }
                                className="w-full rounded-xl border-slate-200 text-sm"
                            />
                        </Field>

                        <button
                            type="submit"
                            className="self-end rounded-xl bg-blue-700 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-800"
                        >
                            Search Rooms
                        </button>
                    </form>
                </section>

                <section className="px-5 py-8">
                    <div className="mx-auto max-w-6xl">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-2xl font-black text-slate-950">
                                Available Rooms
                            </h2>
                            <p className="text-sm text-slate-500">
                                {rooms.length} room(s) found
                            </p>
                        </div>

                        <div className="space-y-4">
                            {rooms.map((room) => (
                                <RoomCard
                                    key={room.id}
                                    room={room}
                                    open={openRoom === room.id}
                                    onToggle={() =>
                                        setOpenRoom(
                                            openRoom === room.id ? null : room.id,
                                        )
                                    }
                                />
                            ))}

                            {rooms.length === 0 && filters.checkin && (
                                <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
                                    <h3 className="text-xl font-black text-slate-900">
                                        No rooms available
                                    </h3>
                                    <p className="mt-2 text-slate-500">
                                        Try different dates or fewer guests.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}

function Field({ label, children }) {
    return (
        <label className="block">
            <span className="text-xs font-bold uppercase text-slate-500">
                {label}
            </span>
            <div className="mt-1">{children}</div>
        </label>
    );
}

function RoomCard({ room, open, onToggle }) {
    const amenities = room.amenities || [];
       <div className="mt-4 flex flex-wrap gap-2">
    {amenities.map((amenity) => {
        const item = amenityMap[amenity];
        if (!item) return null;

        const Icon = item.icon;

        return (
            <div
                key={amenity}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm"
            >
                <Icon size={15} className="text-blue-700" />
                {item.label}
            </div>
        );
    })}
</div>
    return (
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:shadow-xl">
            <div className="grid gap-0 md:grid-cols-[320px_1fr_220px]">
                <div className="relative h-52 overflow-hidden bg-slate-900 md:h-full">
    {room.photos?.length > 0 ? (
        <img
            src={`/storage/${room.photos[0].image_path}`}
            alt={room.name}
            className="h-full w-full object-cover"
        />
    ) : (
        <div className="flex h-full items-center justify-center text-sm text-white/70">
            No room photo
        </div>
    )}

    <div className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-black text-green-600">
        Available
    </div>
</div>

                <div className="p-5">
                    <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-500">
                            Popular
                        </span>
                        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-600">
                            Best value
                        </span>
                    </div>

                    <h3 className="mt-3 text-xl font-black text-slate-950">
                        {room.name}
                    </h3>

                    <p className="text-sm text-slate-500">
                        Room {room.room_number} • {room.max_adults} adults,{' '}
                        {room.max_children} children
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {amenities.map((item) => (
                            <span
                                key={item}
                                className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600"
                            >
                                ✓ {item}
                            </span>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={onToggle}
                        className="mt-4 text-sm font-black text-blue-700 underline"
                    >
                        {open ? 'Hide details' : 'View details & photos'}
                    </button>
                </div>

                <div className="flex flex-col justify-between border-l border-slate-100 p-5 text-right">
                    <div>
                        <p className="text-sm text-slate-500">
                            Total for {room.nights} night(s)
                        </p>
                        <p className="text-3xl font-black text-slate-950">
                            ${Number(room.total_amount).toFixed(2)}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                            ${Number(room.price_per_night).toFixed(2)} / night
                        </p>
                    </div>

              <Link
    href={`/booking/confirm?room_type_id=${room.id}&checkin=${room.checkin}&checkout=${room.checkout}&adults=${room.adults}&children=${room.children}`}
    className="mt-5 inline-block rounded-full border border-blue-700 px-5 py-3 text-sm font-black text-blue-700 hover:bg-blue-700 hover:text-white"
>
    Select Room
</Link>
                </div>
            </div>

            {open && (
                <div className="border-t border-slate-100 bg-slate-50 p-5">
                    <p className="max-w-3xl text-sm leading-6 text-slate-600">
                        {room.description ||
                            'A comfortable room designed for a peaceful and relaxing stay.'}
                    </p>

                    <div className="mt-4 grid gap-3 md:grid-cols-4">
    {room.photos?.length > 0 ? (
        room.photos.map((photo) => (
            <img
                key={photo.id}
                src={`/storage/${photo.image_path}`}
                alt={room.name}
                className="h-28 w-full rounded-2xl object-cover"
            />
        ))
    ) : (
        <div className="rounded-2xl bg-slate-200 p-6 text-sm text-slate-500">
            No photos uploaded yet.
        </div>
    )}
</div>
                </div>
            )}
        </div>
    );
}
