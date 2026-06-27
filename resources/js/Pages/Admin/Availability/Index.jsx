import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';

export default function AvailabilityIndex({ auth, roomTypes, availability }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        room_type_id: roomTypes[0]?.id || '',
        date: '',
        blocked_rooms: 0,
        reason: '',
    });

    function submit(e) {
        e.preventDefault();

        post(route('admin.availability.store'), {
            onSuccess: () => reset('date', 'blocked_rooms', 'reason'),
        });
    }

    function deleteRecord(id) {
        if (!confirm('Remove this availability record?')) return;

        router.delete(route('admin.availability.destroy', id));
    }

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Availability" />

            <main className="min-h-screen bg-slate-100 px-4 py-6">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-5 rounded-2xl bg-slate-950 p-5 text-white">
                        <h1 className="text-2xl font-black">
                            Availability Management
                        </h1>
                        <p className="text-sm text-slate-300">
                            Block rooms manually for maintenance, offline reservations,
                            or unavailable dates.
                        </p>
                    </div>

                    <form
                        onSubmit={submit}
                        className="rounded-2xl bg-white p-5 shadow-sm"
                    >
                        <h2 className="mb-4 text-lg font-black">
                            Block Rooms
                        </h2>

                        <div className="grid gap-4 md:grid-cols-4">
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
                                    {roomTypes.map((roomType) => (
                                        <option
                                            key={roomType.id}
                                            value={roomType.id}
                                        >
                                            {roomType.name} ({roomType.total_rooms})
                                        </option>
                                    ))}
                                </select>
                                {errors.room_type_id && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.room_type_id}
                                    </p>
                                )}
                            </label>

                            <Input
                                label="Date"
                                type="date"
                                value={data.date}
                                error={errors.date}
                                onChange={(e) =>
                                    setData('date', e.target.value)
                                }
                            />

                            <Input
                                label="Blocked Rooms"
                                type="number"
                                value={data.blocked_rooms}
                                error={errors.blocked_rooms}
                                onChange={(e) =>
                                    setData('blocked_rooms', e.target.value)
                                }
                            />

                            <Input
                                label="Reason"
                                value={data.reason}
                                error={errors.reason}
                                onChange={(e) =>
                                    setData('reason', e.target.value)
                                }
                            />
                        </div>

                        <button
                            disabled={processing}
                            className="mt-4 rounded-xl bg-blue-700 px-5 py-2 text-sm font-bold text-white hover:bg-blue-800"
                        >
                            {processing ? 'Saving...' : 'Save Availability'}
                        </button>
                    </form>

                    <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm">
                        <div className="border-b border-slate-100 p-5">
                            <h2 className="text-lg font-black">
                                Current Manual Blocks
                            </h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                                    <tr>
                                        <th className="px-4 py-3">Room Type</th>
                                        <th className="px-4 py-3">Date</th>
                                        <th className="px-4 py-3">Blocked</th>
                                        <th className="px-4 py-3">Reason</th>
                                        <th className="px-4 py-3">Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {availability.length > 0 ? (
                                        availability.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="border-t border-slate-100"
                                            >
                                                <td className="px-4 py-3 font-bold">
                                                    {item.room_type?.name}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {item.date}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {item.blocked_rooms}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {item.reason || '—'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            deleteRecord(item.id)
                                                        }
                                                        className="rounded-lg bg-red-700 px-3 py-2 text-xs font-bold text-white hover:bg-red-800"
                                                    >
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="px-4 py-8 text-center text-slate-500"
                                            >
                                                No manual availability blocks yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
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
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </label>
    );
}
