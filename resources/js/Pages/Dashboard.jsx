import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth, stats }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Admin Dashboard" />

            <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 py-6">
                <div className="mx-auto max-w-6xl px-4">
                    <div className="mb-5 overflow-hidden rounded-2xl bg-slate-950 shadow-sm">
                        <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-blue-700 p-6 text-white">
                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-200">
                                Poolside Villa Guest House
                            </p>
                            <h1 className="mt-2 text-2xl font-bold">
                                Admin Dashboard
                            </h1>
                            <p className="mt-1 max-w-2xl text-sm text-slate-200">
                                A clean control center for bookings, rooms,
                                staff, and room availability.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Card title="Rooms" value={stats?.rooms ?? 0} />
                        <Card title="Bookings" value={stats?.bookings ?? 0} />
                        <Card title="Pending" value={stats?.pending ?? 0} />
                        <Card title="Confirmed" value={stats?.confirmed ?? 0} />
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                        <ActionCard
                            title="Manage Rooms"
                            text="Add rooms, update prices, upload photos, and edit amenities."
                            href={route('admin.rooms.index')}
                            button="Open Rooms"
                        />

                        <ActionCard
                            title="Manage Bookings"
                            text="Confirm, cancel, and review guest booking requests."
                            href={route('admin.bookings.index')}
                            button="Open Bookings"
                            dark
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function Card({ title, value }) {
    return (
        <div className="rounded-2xl border border-white bg-white/90 p-4 shadow-sm shadow-blue-100">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                {title}
            </p>
            <h3 className="mt-2 text-3xl font-black text-blue-700">
                {value}
            </h3>
        </div>
    );
}

function ActionCard({ title, text, href, button, dark = false }) {
    return (
        <div
            className={
                dark
                    ? 'rounded-2xl bg-slate-950 p-5 text-white shadow-sm'
                    : 'rounded-2xl bg-white p-5 text-slate-900 shadow-sm'
            }
        >
            <h2 className="text-lg font-bold">{title}</h2>
            <p
                className={
                    dark
                        ? 'mt-1 text-sm text-slate-300'
                        : 'mt-1 text-sm text-slate-500'
                }
            >
                {text}
            </p>

            <Link
                href={href}
                className={
                    dark
                        ? 'mt-4 inline-block rounded-lg bg-white px-4 py-2 text-sm font-bold text-slate-950'
                        : 'mt-4 inline-block rounded-lg bg-blue-700 px-4 py-2 text-sm font-bold text-white'
                }
            >
                {button}
            </Link>
        </div>
    );
}
