import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';

export default function CalendarIndex({
    auth,
    month,
    monthLabel,
    previousMonth,
    nextMonth,
    dates,
    roomUnits,
    bookings,
    roomTypes,
    filters,
    searchResults,
}) {
    const { data, setData, get, processing, errors } = useForm({
        checkin: filters?.checkin || '',
        checkout: filters?.checkout || '',
        room_type_id: filters?.room_type_id || '',
    });

    function searchAvailability(e) {
        e.preventDefault();

        get(route('admin.calendar.index'), {
            preserveScroll: true,
            preserveState: true,
        });
    }

    function bookingFor(roomUnit, date) {
        return bookings.find((booking) => {
            return (
                booking.room_unit_id === roomUnit.id &&
                booking.checkin_date <= date &&
                booking.checkout_date > date
            );
        });
    }

    function cellClass(booking, roomUnit) {
        if (roomUnit.status === 'maintenance') {
            return 'bg-orange-100 text-orange-700';
        }

        if (!booking) {
            return 'bg-green-50 text-green-700';
        }

        if (booking.stay_status === 'checked_in') {
            return 'bg-blue-700 text-white';
        }

        if (booking.status === 'confirmed') {
            return 'bg-red-100 text-red-700';
        }

        return 'bg-yellow-100 text-yellow-700';
    }

    function cellLabel(booking, roomUnit) {
        if (roomUnit.status === 'maintenance') {
            return 'Maint.';
        }

        if (!booking) {
            return 'Free';
        }

        if (booking.stay_status === 'checked_in') {
            return 'Occupied';
        }

        if (booking.status === 'confirmed') {
            return 'Booked';
        }

        return 'Pending';
    }

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Booking Calendar" />

            <main className="min-h-screen bg-slate-100 px-4 py-6">
                <div className="mx-auto max-w-[1500px]">
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-950 p-5 text-white">
                        <div>
                            <h1 className="text-2xl font-black">
                                Booking Calendar
                            </h1>
                            <p className="text-sm text-slate-300">
                                Visual view of assigned rooms, bookings, occupied stays, and quick availability search.
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <Link
                                href={route('admin.calendar.index', {
                                    month: previousMonth,
                                })}
                                className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-950"
                            >
                                ← Previous
                            </Link>

                            <div className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-black">
                                {monthLabel}
                            </div>

                            <Link
                                href={route('admin.calendar.index', {
                                    month: nextMonth,
                                })}
                                className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-950"
                            >
                                Next →
                            </Link>
                        </div>
                    </div>

                    <form
                        onSubmit={searchAvailability}
                        className="mb-5 rounded-2xl bg-white p-5 shadow-sm"
                    >
                        <h2 className="text-lg font-black text-slate-950">
                            Quick Availability Search
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Use this when a caller asks whether a room is available for specific dates.
                        </p>

                        <div className="mt-4 grid gap-4 md:grid-cols-4">
                            <Input
                                label="Check-in"
                                type="date"
                                value={data.checkin}
                                error={errors.checkin}
                                onChange={(e) =>
                                    setData('checkin', e.target.value)
                                }
                            />

                            <Input
                                label="Check-out"
                                type="date"
                                value={data.checkout}
                                error={errors.checkout}
                                onChange={(e) =>
                                    setData('checkout', e.target.value)
                                }
                            />

                            <label>
                                <span className="text-sm font-bold text-slate-700">
                                    Room Type
                                </span>
                                <select
                                    value={data.room_type_id}
                                    onChange={(e) =>
                                        setData('room_type_id', e.target.value)
                                    }
                                    className="mt-1 w-full rounded-xl border-slate-200 text-sm"
                                >
                                    <option value="">All Room Types</option>
                                    {roomTypes.map((roomType) => (
                                        <option
                                            key={roomType.id}
                                            value={roomType.id}
                                        >
                                            {roomType.name}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <div className="flex items-end">
                                <button
                                    disabled={processing}
                                    className="w-full rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white hover:bg-blue-800"
                                >
                                    {processing ? 'Checking...' : 'Check Availability'}
                                </button>
                            </div>
                        </div>
                    </form>

                    {searchResults && (
                        <div className="mb-5 grid gap-4 lg:grid-cols-2">
                            <section className="rounded-2xl bg-white p-5 shadow-sm">
                                <h2 className="text-lg font-black text-green-700">
                                    Available Rooms ({searchResults.available.length})
                                </h2>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    {searchResults.available.length > 0 ? (
                                        searchResults.available.map((unit) => (
                                            <div
                                                key={unit.id}
                                                className="rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700"
                                            >
                                                Room {unit.room_number} • {unit.room_type_name}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-slate-500">
                                            No available rooms for those dates.
                                        </p>
                                    )}
                                </div>
                            </section>

                            <section className="rounded-2xl bg-white p-5 shadow-sm">
                                <h2 className="text-lg font-black text-red-700">
                                    Busy Rooms ({searchResults.busy.length})
                                </h2>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    {searchResults.busy.length > 0 ? (
                                        searchResults.busy.map((unit) => (
                                            <div
                                                key={unit.id}
                                                className="rounded-full bg-red-100 px-4 py-2 text-sm font-bold text-red-700"
                                            >
                                                Room {unit.room_number} • {unit.room_type_name}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-slate-500">
                                            No busy rooms for those dates.
                                        </p>
                                    )}
                                </div>
                            </section>
                        </div>
                    )}

                    <div className="mb-4 flex flex-wrap gap-2 text-xs font-bold">
                        <Legend label="Free" className="bg-green-50 text-green-700" />
                        <Legend label="Pending" className="bg-yellow-100 text-yellow-700" />
                        <Legend label="Booked" className="bg-red-100 text-red-700" />
                        <Legend label="Occupied" className="bg-blue-700 text-white" />
                        <Legend label="Maintenance" className="bg-orange-100 text-orange-700" />
                    </div>

                    <div className="overflow-auto rounded-2xl bg-white shadow-sm">
                        <table className="min-w-[1200px] border-collapse text-xs">
                            <thead>
                                <tr className="bg-slate-50">
                                    <th className="sticky left-0 z-20 w-44 border-b border-r bg-slate-50 px-3 py-3 text-left">
                                        Room
                                    </th>

                                    {dates.map((date) => (
                                        <th
                                            key={date.date}
                                            className="min-w-24 border-b px-2 py-3 text-center"
                                        >
                                            <div className="font-black">
                                                {date.day}
                                            </div>
                                            <div className="text-slate-500">
                                                {date.label}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {roomUnits.map((roomUnit) => (
                                    <tr key={roomUnit.id}>
                                        <td className="sticky left-0 z-10 border-r border-t bg-white px-3 py-3">
                                            <p className="font-black text-slate-950">
                                                Room {roomUnit.room_number}
                                            </p>
                                            <p className="text-slate-500">
                                                {roomUnit.room_type?.name}
                                            </p>
                                        </td>

                                        {dates.map((date) => {
                                            const booking = bookingFor(
                                                roomUnit,
                                                date.date,
                                            );

                                            return (
                                                <td
                                                    key={date.date}
                                                    className="border-t p-1"
                                                >
                                                    <div
                                                        title={
                                                            booking
                                                                ? `${booking.booking_reference} - ${booking.guest_name}`
                                                                : ''
                                                        }
                                                        className={`rounded-lg px-2 py-2 text-center font-bold ${cellClass(
                                                            booking,
                                                            roomUnit,
                                                        )}`}
                                                    >
                                                        <div>
                                                            {cellLabel(
                                                                booking,
                                                                roomUnit,
                                                            )}
                                                        </div>

                                                        {booking && (
                                                            <div className="truncate text-[10px] opacity-80">
                                                                {
                                                                    booking.guest_name
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </AuthenticatedLayout>
    );
}

function Input({ label, value, onChange, error, type = 'text' }) {
    return (
        <label>
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

function Legend({ label, className }) {
    return (
        <span className={`rounded-full px-3 py-1 ${className}`}>
            {label}
        </span>
    );
}
