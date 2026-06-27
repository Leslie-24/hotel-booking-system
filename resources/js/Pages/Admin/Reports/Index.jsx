import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function ReportsIndex({ auth, stats, popularRoomTypes, topGuests }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Reports" />
            <a
    href={route('admin.reports.bookings.pdf')}
    className="mb-5 inline-block rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white hover:bg-blue-800"
>
    Export Bookings PDF
</a>
<a
    href={route('admin.reports.bookings.excel')}
    className="mb-5 ml-3 inline-block rounded-xl bg-green-700 px-5 py-3 text-sm font-bold text-white hover:bg-green-800"
>
    Export Bookings Excel
</a>
<a
    href={route('admin.reports.revenue.excel')}
    className="mb-5 ml-3 inline-block rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-800"
>
    Export Revenue Excel
</a>
            <main className="min-h-screen bg-slate-100 px-4 py-6">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-5 rounded-2xl bg-slate-950 p-5 text-white">
                        <h1 className="text-2xl font-black">Reports</h1>
                        <p className="text-sm text-slate-300">
                            Revenue, occupancy, popular room types, and guest performance.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Card title="Total Rooms" value={stats.totalRooms} />
                        <Card title="Occupied Rooms" value={stats.occupiedRooms} />
                        <Card title="Occupancy Rate" value={`${stats.occupancyRate}%`} />
                        <Card title="Total Bookings" value={stats.totalBookings} />
                        <Card
                            title="Today Revenue"
                            value={`$${Number(stats.todayRevenue || 0).toFixed(2)}`}
                        />
                        <Card
                            title="Monthly Revenue"
                            value={`$${Number(stats.monthlyRevenue || 0).toFixed(2)}`}
                        />
                        <Card
                            title="Confirmed Bookings"
                            value={stats.confirmedBookings}
                        />
                    </div>

                    <div className="mt-6 grid gap-5 lg:grid-cols-2">
                        <section className="rounded-2xl bg-white p-5 shadow-sm">
                            <h2 className="text-lg font-black text-slate-950">
                                Most Popular Room Types
                            </h2>

                            <div className="mt-4 space-y-3">
                                {popularRoomTypes.length > 0 ? (
                                    popularRoomTypes.map((roomType) => (
                                        <div
                                            key={roomType.id}
                                            className="flex items-center justify-between rounded-xl bg-slate-50 p-3"
                                        >
                                            <span className="font-bold text-slate-800">
                                                {roomType.name}
                                            </span>
                                            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-700">
                                                {roomType.bookings_count} bookings
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-500">
                                        No booking data yet.
                                    </p>
                                )}
                            </div>
                        </section>

                        <section className="rounded-2xl bg-white p-5 shadow-sm">
                            <h2 className="text-lg font-black text-slate-950">
                                Top Guests
                            </h2>

                            <div className="mt-4 overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="text-xs uppercase text-slate-500">
                                        <tr>
                                            <th className="py-2">Guest</th>
                                            <th className="py-2">Stays</th>
                                            <th className="py-2">Spent</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {topGuests.length > 0 ? (
                                            topGuests.map((guest) => (
                                                <tr
                                                    key={guest.guest_key}
                                                    className="border-t border-slate-100"
                                                >
                                                    <td className="py-3">
                                                        <p className="font-bold text-slate-900">
                                                            {guest.guest_name}
                                                        </p>
                                                        <p className="text-xs text-slate-500">
                                                            {guest.guest_email || guest.guest_phone}
                                                        </p>
                                                    </td>
                                                    <td className="py-3 font-bold">
                                                        {guest.total_stays}
                                                    </td>
                                                    <td className="py-3 font-black text-green-700">
                                                        ${Number(guest.total_spent || 0).toFixed(2)}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="3"
                                                    className="py-6 text-center text-slate-500"
                                                >
                                                    No guest data yet.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </AuthenticatedLayout>
    );
}

function Card({ title, value }) {
    return (
        <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                {title}
            </p>
            <h3 className="mt-2 text-3xl font-black text-blue-700">
                {value}
            </h3>
        </div>
    );
}
