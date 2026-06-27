import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth, stats }) {
    const role = auth.user.role;

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard" />

            <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 py-6">
                <div className="mx-auto max-w-6xl px-4">
                    <div className="mb-5 overflow-hidden rounded-2xl bg-slate-950 shadow-sm">
                        <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-blue-700 p-6 text-white">
                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-200">
                                Poolside Villa Guest House
                            </p>

                            <h1 className="mt-2 text-2xl font-bold">
                                {role === 'admin' && 'Admin Dashboard'}
                                {role === 'receptionist' && 'Reception Dashboard'}
                                {role === 'manager' && 'Manager Dashboard'}
                            </h1>

                            <p className="mt-1 max-w-2xl text-sm text-slate-200">
                                {role === 'admin' &&
                                    'Manage hotel operations, staff, bookings, rooms, availability, and revenue.'}
                                {role === 'receptionist' &&
                                    'Handle bookings, walk-in guests, room assignment, check-ins, and check-outs.'}
                                {role === 'manager' &&
                                    'Monitor performance, occupancy, bookings, and revenue.'}
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Card title="Total Bookings" value={stats?.bookings ?? 0} />
                        <Card title="Pending" value={stats?.pendingBookings ?? 0} />
                        <Card title="Occupied Rooms" value={stats?.occupiedRooms ?? 0} />
                        <Card title="Available Rooms" value={stats?.availableRooms ?? 0} />

                        {role !== 'receptionist' && (
                            <Card
                                title="Monthly Revenue"
                                value={`$${Number(stats?.monthlyRevenue ?? 0).toFixed(2)}`}
                            />
                        )}

                        <Card title="Today Check-ins" value={stats?.todayCheckIns ?? 0} />
                        <Card title="Today Check-outs" value={stats?.todayCheckOuts ?? 0} />
                    </div>

                    {role === 'admin' && <AdminActions />}
                    {role === 'receptionist' && <ReceptionActions />}
                    {role === 'manager' && <ManagerActions />}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function AdminActions() {
    return (
        <div className="mt-5 grid gap-4 md:grid-cols-3">
            <ActionCard
                title="Room Types"
                text="Manage room categories, photos, room numbers, amenities, and inventory."
                href={route('admin.room-types.index')}
                button="Open Room Types"
            />

            <ActionCard
                title="Bookings"
                text="Confirm bookings, assign room numbers, check guests in, and check them out."
                href={route('admin.bookings.index')}
                button="Open Bookings"
                dark
            />

            <ActionCard
                title="Staff"
                text="Create receptionist, manager, and admin accounts."
                href={route('admin.users.index')}
                button="Manage Staff"
            />

            <ActionCard
                title="Availability"
                text="Block rooms manually for maintenance or offline reservations."
                href={route('admin.availability.index')}
                button="Open Availability"
            />

            <ActionCard
                title="Walk-in Booking"
                text="Create direct reception bookings for guests who arrive in person."
                href={route('admin.walk-in-bookings.create')}
                button="Add Walk-in"
                dark
            />
            <ActionCard
    title="Booking Calendar"
    text="Visual room occupancy and reservation schedule."
    href={route('admin.calendar.index')}
    button="Open Calendar"
/>
            <ActionCard
    title="Reports"
    text="View revenue, occupancy, top guests, and export booking reports."
    href={route('admin.reports.index')}
    button="Open Reports"
    dark
/>
        </div>
    );
}

function ReceptionActions() {
    return (
        <div className="mt-5 grid gap-4 md:grid-cols-3">
            <ActionCard
                title="Bookings"
                text="Assign rooms, confirm bookings, check guests in, and check them out."
                href={route('admin.bookings.index')}
                button="Open Bookings"
                dark
            />

            <ActionCard
                title="Walk-in Booking"
                text="Create a booking for a guest at the reception desk."
                href={route('admin.walk-in-bookings.create')}
                button="Add Walk-in"
            />

            <ActionCard
                title="Availability"
                text="View or block rooms for offline reservations or temporary unavailability."
                href={route('admin.availability.index')}
                button="Open Availability"
            />
            <ActionCard
    title="Booking Calendar"
    text="Visual room occupancy and reservation schedule."
    href={route('admin.calendar.index')}
    button="Open Calendar"
/>
        </div>
    );
}

function ManagerActions() {
    return (
        <div className="mt-5 grid gap-4 md:grid-cols-3">
            <ActionCard
                title="Bookings"
                text="View current bookings and guest activity."
                href={route('admin.bookings.index')}
                button="View Bookings"
                dark
            />

            <ActionCard
                title="Availability"
                text="Review room availability and occupancy."
                href={route('admin.availability.index')}
                button="View Availability"
            />
<ActionCard
    title="Booking Calendar"
    text="Visual room occupancy and reservation schedule."
    href={route('admin.calendar.index')}
    button="Open Calendar"
/>
            <ActionCard
                title="Reports"
                text="Monitor revenue, occupancy rates, top guests and exports."
                href={route('admin.reports.index')}
                button="Open Reports"
                dark
            />
        </div>
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
            <p className={dark ? 'mt-1 text-sm text-slate-300' : 'mt-1 text-sm text-slate-500'}>
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
