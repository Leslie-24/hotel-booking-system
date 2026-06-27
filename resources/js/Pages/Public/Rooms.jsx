import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

const amenityMap = {
    wifi: 'WiFi',
    breakfast: 'Breakfast',
    pool: 'Pool',
    parking: 'Parking',
    tv: 'Smart TV',
    ac: 'Air Conditioning',
};

export default function Rooms({ rooms }) {
    const [openRoom, setOpenRoom] = useState(null);

    return (
        <>
            <Head title="Rooms & Suites" />

            <main className="min-h-screen bg-slate-100">
                <section className="bg-slate-950 text-white">
                    <div className="mx-auto max-w-6xl px-5 py-12">
                        <p className="text-sm font-bold uppercase tracking-[0.3em] text-blue-200">
                            Poolside Villa
                        </p>

                        <h1 className="mt-3 text-4xl font-black">
                            Rooms & Suites
                        </h1>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                            Explore our room types, amenities, and comfort options
                            before choosing your stay.
                        </p>

                    </div>
                    <p>
                            <Link href="/booking" className="text-sm font-bold text-blue-700">
                                ← Back to Home
                            </Link>
                        </p>
                </section>
                <section className="mx-auto max-w-6xl px-5 py-8">
                    <div className="space-y-5">
                        {rooms.map((room) => {
                            const primaryPhoto = room.photos?.[0];

                            return (
                                <div
                                    key={room.id}
                                    className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-xl"
                                >
                                    <div className="grid md:grid-cols-[280px_1fr]">
                                        <div className="h-56 overflow-hidden bg-slate-900 md:h-full">
                                            {primaryPhoto ? (
                                                <img
                                                    src={`/storage/${primaryPhoto.image_path}`}
                                                    alt={room.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-sm text-white/70">
                                                    No room photo
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-5">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <h2 className="text-2xl font-black text-slate-950">
                                                        {room.name}
                                                    </h2>

                                                    <p className="mt-1 text-sm text-slate-500">
                                                        {room.total_rooms} rooms in this category
                                                    </p>
                                                </div>

                                                <div className="text-right">
                                                    <p className="text-xs text-slate-500">
                                                        Starting from
                                                    </p>

                                                    <h3 className="text-2xl font-black text-blue-700">
                                                        ${Number(room.price_per_night).toFixed(2)}
                                                    </h3>

                                                    <p className="text-xs text-slate-500">
                                                        per night
                                                    </p>
                                                </div>
                                            </div>

                                            <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">
                                                {room.description ||
                                                    'A comfortable room designed for a peaceful stay.'}
                                            </p>

                                            <div className="mt-4 flex flex-wrap gap-2">
                                                {(room.amenities || []).map((amenity) => (
                                                    <div
                                                        key={amenity}
                                                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700"
                                                    >
                                                        {amenityMap[amenity] || amenity}
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-5 flex flex-wrap gap-5 text-sm text-slate-700">
                                                <div>
                                                    <span className="font-black">Adults:</span>{' '}
                                                    {room.max_adults}
                                                </div>

                                                <div>
                                                    <span className="font-black">Children:</span>{' '}
                                                    {room.max_children}
                                                </div>
                                            </div>

                                            <div className="mt-6 flex flex-wrap gap-3">
                                                <Link
                                                    href="/booking"
                                                    className="rounded-full bg-blue-700 px-5 py-3 text-sm font-black text-white hover:bg-blue-800"
                                                >
                                                    Check Availability
                                                </Link>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setOpenRoom(
                                                            openRoom === room.id ? null : room.id,
                                                        )
                                                    }
                                                    className="rounded-full border border-slate-300 px-5 py-3 text-sm font-black text-slate-700 hover:bg-slate-100"
                                                >
                                                    {openRoom === room.id
                                                        ? 'Hide Details'
                                                        : 'View Details'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {openRoom === room.id && (
                                        <div className="border-t border-slate-100 bg-slate-50 p-5">
                                            <h3 className="text-lg font-black text-slate-950">
                                                Room Details & Photos
                                            </h3>

                                            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                                                {room.description ||
                                                    'A comfortable room designed for a peaceful and relaxing stay.'}
                                            </p>

                                            <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                                                {room.photos?.length > 0 ? (
                                                    room.photos.map((photo) => (
                                                        <img
                                                            key={photo.id}
                                                            src={`/storage/${photo.image_path}`}
                                                            alt={room.name}
                                                            className="h-32 w-full rounded-2xl object-cover"
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
                        })}
                    </div>
                </section>
            </main>
        </>
    );
}
