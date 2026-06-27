import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function WalkInBookingCreate({ auth, roomTypes, roomUnits }) {
    const { data, setData, post, processing, errors } = useForm({
        room_type_id: roomTypes[0]?.id || '',
        room_unit_id: '',
        guest_name: '',
        guest_email: '',
        guest_phone: '',
        checkin: '',
        checkout: '',
        adults: 1,
        children: 0,
        special_request: '',
        check_in_now: false,
    });

    const availableUnits = roomUnits.filter(
        (unit) => Number(unit.room_type_id) === Number(data.room_type_id),
    );

    function submit(e) {
        e.preventDefault();

        post(route('admin.walk-in-bookings.store'));
    }

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Walk-in Booking" />

            <main className="min-h-screen bg-slate-100 px-4 py-6">
                <div className="mx-auto max-w-5xl">
                    <div className="mb-5 rounded-2xl bg-slate-950 p-5 text-white">
                        <h1 className="text-2xl font-black">
                            Create Walk-in Booking
                        </h1>
                        <p className="text-sm text-slate-300">
                            Register guests who book directly at the reception.
                        </p>
                    </div>

                    <form
                        onSubmit={submit}
                        className="rounded-2xl bg-white p-5 shadow-sm"
                    >
                        <div className="grid gap-4 md:grid-cols-2">
                            <label>
                                <span className="text-sm font-bold text-slate-700">
                                    Room Type
                                </span>
                                <select
                                    value={data.room_type_id}
                                    onChange={(e) => {
                                        setData({
                                            ...data,
                                            room_type_id: e.target.value,
                                            room_unit_id: '',
                                        });
                                    }}
                                    className="mt-1 w-full rounded-xl border-slate-200 text-sm"
                                >
                                    {roomTypes.map((roomType) => (
                                        <option
                                            key={roomType.id}
                                            value={roomType.id}
                                        >
                                            {roomType.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.room_type_id && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.room_type_id}
                                    </p>
                                )}
                            </label>

                            <label>
                                <span className="text-sm font-bold text-slate-700">
                                    Assign Room Number
                                </span>
                                <select
                                    value={data.room_unit_id}
                                    onChange={(e) =>
                                        setData('room_unit_id', e.target.value)
                                    }
                                    className="mt-1 w-full rounded-xl border-slate-200 text-sm"
                                >
                                    <option value="">
                                        Assign later
                                    </option>
                                    {availableUnits.map((unit) => (
                                        <option key={unit.id} value={unit.id}>
                                            Room {unit.room_number}
                                        </option>
                                    ))}
                                </select>
                                {errors.room_unit_id && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.room_unit_id}
                                    </p>
                                )}
                            </label>

                            <Input
                                label="Guest Name"
                                value={data.guest_name}
                                error={errors.guest_name}
                                onChange={(e) =>
                                    setData('guest_name', e.target.value)
                                }
                            />

                            <Input
                                label="Guest Email (optional)"
                                type="email"
                                value={data.guest_email}
                                error={errors.guest_email}
                                onChange={(e) =>
                                    setData('guest_email', e.target.value)
                                }
                            />

                            <Input
                                label="Guest Phone"
                                value={data.guest_phone}
                                error={errors.guest_phone}
                                onChange={(e) =>
                                    setData('guest_phone', e.target.value)
                                }
                            />

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

                            <Input
                                label="Adults"
                                type="number"
                                value={data.adults}
                                error={errors.adults}
                                onChange={(e) =>
                                    setData('adults', e.target.value)
                                }
                            />

                            <Input
                                label="Children"
                                type="number"
                                value={data.children}
                                error={errors.children}
                                onChange={(e) =>
                                    setData('children', e.target.value)
                                }
                            />

                            <label className="md:col-span-2">
                                <span className="text-sm font-bold text-slate-700">
                                    Notes / Special Request
                                </span>
                                <textarea
                                    rows="3"
                                    value={data.special_request}
                                    onChange={(e) =>
                                        setData(
                                            'special_request',
                                            e.target.value,
                                        )
                                    }
                                    className="mt-1 w-full rounded-xl border-slate-200 text-sm"
                                />
                            </label>

                            <label className="flex items-center gap-3 md:col-span-2">
                                <input
                                    type="checkbox"
                                    checked={data.check_in_now}
                                    onChange={(e) =>
                                        setData(
                                            'check_in_now',
                                            e.target.checked,
                                        )
                                    }
                                    className="rounded border-slate-300"
                                />
                                <span className="text-sm font-bold text-slate-700">
                                    Check in immediately / mark room occupied
                                </span>
                            </label>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <button
                                disabled={processing}
                                className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white hover:bg-blue-800"
                            >
                                {processing
                                    ? 'Saving...'
                                    : 'Create Walk-in Booking'}
                            </button>

                            <Link
                                href={route('admin.bookings.index')}
                                className="rounded-xl bg-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-300"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
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
