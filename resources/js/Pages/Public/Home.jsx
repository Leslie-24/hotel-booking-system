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

export default function Home({ featuredRooms }) {
    const [openRoom, setOpenRoom] = useState(null);

    return (
        <>
            <Head title="Poolside Villa Guest House" />

            <main className="min-h-screen bg-slate-950 text-white">
                <section className="relative overflow-hidden">
                    <div className="absolute -left-24 top-20 h-72 w-72 animate-pulse rounded-full bg-blue-600/30 blur-3xl" />
                    <div className="absolute right-0 top-0 h-96 w-96 animate-pulse rounded-full bg-cyan-400/20 blur-3xl" />

                    <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
                        <Link href="/" className="font-black">
                            Poolside Villa
                        </Link>

                        <div className="flex gap-3">
    <Link
        href="/booking/manage"
        className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold hover:bg-white hover:text-slate-950"
    >
        Manage Booking
    </Link>

    <Link
        href="/login"
        className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold hover:bg-white hover:text-slate-950"
    >
        Staff Login
    </Link>
</div>
                    </nav>

                    <div className="relative z-10 mx-auto grid min-h-[70vh] max-w-6xl items-center gap-10 px-5 py-10 md:grid-cols-2">
                        <div>
                            <p className="mb-3 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm text-blue-100">
                                Elegant stays • Simple booking • Peaceful comfort
                            </p>

                            <h1 className="text-4xl font-black leading-tight md:text-6xl">
                                Relax by the pool. Book with confidence.
                            </h1>

                            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
                                Discover calm rooms, warm service, and a smooth booking experience at Poolside Villa Guest House.
                            </p>

                            <div className="mt-7 flex flex-wrap gap-3">
                                <Link href="/booking" className="rounded-full bg-blue-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-400">
                                    Check Availability
                                </Link>

                                <Link href="/rooms" className="rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-950 hover:bg-blue-50">
                                    View Rooms
                                </Link>
                            </div>
                        </div>

                        <div className="rounded-[2rem] border border-white/10 bg-white/10 p-3 shadow-2xl backdrop-blur">
                            <div className="h-[340px] rounded-[1.5rem] bg-gradient-to-br from-blue-500 via-slate-800 to-black p-6">
                                <div className="flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-black/20 p-5">
                                    <p className="text-sm text-blue-100">Featured Experience</p>
                                    <div>
                                        <h3 className="text-3xl font-black">Poolside Comfort</h3>
                                        <p className="mt-2 text-sm text-slate-300">
                                            Clean rooms, quiet atmosphere, and flexible guest-house booking.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="rooms" className="bg-white px-5 py-12 text-slate-950">
                    <div className="mx-auto max-w-6xl">
                        <div className="mb-6 flex items-end justify-between">
                            <div>
                                <p className="text-sm font-bold uppercase text-blue-700">
                                    Rooms
                                </p>
                                <h2 className="text-2xl font-black">
                                    Featured Room Types
                                </h2>
                            </div>

                            <Link href="/rooms" className="rounded-full bg-slate-950 px-5 py-2 text-sm font-bold text-white">
                                View All
                            </Link>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            {featuredRooms.map((room) => {
                                const primaryPhoto = room.photos?.[0];

                                return (
                                    <div
                                        key={room.id}
                                        className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                                    >
                                        <div className="h-44 overflow-hidden bg-slate-900">
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

                                        <div className="p-4">
                                            <h3 className="font-black">{room.name}</h3>

                                            <p className="mt-1 text-sm text-slate-500">
                                                {room.total_rooms} rooms in this category
                                            </p>

                                            <p className="mt-3 text-lg font-black text-blue-700">
                                                ${Number(room.price_per_night).toFixed(2)} / night
                                            </p>

                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {(room.amenities || []).slice(0, 3).map((amenity) => (
                                                    <span
                                                        key={amenity}
                                                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700"
                                                    >
                                                        {amenityMap[amenity] || amenity}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="mt-4 flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setOpenRoom(openRoom === room.id ? null : room.id)
                                                    }
                                                    className="rounded-full border border-slate-300 px-4 py-2 text-xs font-black text-slate-700 hover:bg-slate-100"
                                                >
                                                    {openRoom === room.id ? 'Hide Details' : 'View Details'}
                                                </button>

                                                <Link
                                                    href="/booking"
                                                    className="rounded-full bg-blue-700 px-4 py-2 text-xs font-black text-white hover:bg-blue-800"
                                                >
                                                    Book
                                                </Link>
                                            </div>
                                        </div>

                                        {openRoom === room.id && (
                                            <div className="border-t bg-slate-50 p-4">
                                                <p className="text-sm leading-6 text-slate-600">
                                                    {room.description || 'A comfortable room designed for a peaceful stay.'}
                                                </p>

                                                <div className="mt-3 grid grid-cols-3 gap-2">
                                                    {room.photos?.length > 0 ? (
                                                        room.photos.map((photo) => (
                                                            <img
                                                                key={photo.id}
                                                                src={`/storage/${photo.image_path}`}
                                                                alt={room.name}
                                                                className="h-20 w-full rounded-xl object-cover"
                                                            />
                                                        ))
                                                    ) : (
                                                        <p className="col-span-3 text-sm text-slate-500">
                                                            No photos uploaded yet.
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
                <footer className="mt-20 bg-slate-950 text-white">
    <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-3">
            <div>
                <h3 className="text-lg font-black">
                    Poolside Villa Guest House
                </h3>
                <p className="mt-3 text-sm text-slate-400">
                    Comfortable accommodation, exceptional hospitality,
                    and a relaxing stay in Rwanda.
                </p>
            </div>

            <div>
                <h3 className="text-lg font-black">
                    Contact Information
                </h3>

                <div className="mt-3 space-y-2 text-sm text-slate-400">
                    <p>📍 Kigali, Rwanda</p>
                    <p>📞 +250 XXX XXX XXX</p>
                    <p>📧 reservations@poolsidevilla.com</p>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-black">
                    Quick Links
                </h3>

                <div className="mt-3 flex flex-col gap-2 text-sm">
                    <Link
                        href="/booking/manage"
                        className="text-slate-400 hover:text-white"
                    >
                        Manage Booking
                    </Link>

                    <Link
                        href="/login"
                        className="text-slate-400 hover:text-white"
                    >
                        Staff Login
                    </Link>
                </div>
            </div>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
            © {new Date().getFullYear()} Poolside Villa Guest House. All rights reserved.
        </div>
    </div>
</footer>
            </main>
        </>
    );
}
