import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

const amenityOptions = [
    ['wifi', ' WiFi'],
    ['breakfast', ' Breakfast'],
    ['pool', ' Pool'],
    ['parking', ' Parking'],
    ['tv', ' Smart TV'],
    ['ac', ' Air Conditioning'],
];

export default function RoomsIndex({ auth, rooms }) {
    const [editingRoom, setEditingRoom] = useState(null);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Manage Rooms" />

            <main className="min-h-screen bg-slate-100 px-4 py-6">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-5 rounded-2xl bg-slate-950 p-5 text-white">
                        <h1 className="text-2xl font-black">Manage Rooms</h1>
                        <p className="text-sm text-slate-300">
                            Add rooms, update prices, amenities, and upload photos.
                        </p>
                    </div>

                    <RoomForm />

                    <div className="mt-6 space-y-4">
                        {rooms.map((room) => (
                            <RoomItem
                                key={room.id}
                                room={room}
                                editing={editingRoom === room.id}
                                onEdit={() =>
                                    setEditingRoom(
                                        editingRoom === room.id ? null : room.id,
                                    )
                                }
                            />
                        ))}
                    </div>
                </div>
            </main>
        </AuthenticatedLayout>
    );
}

function RoomForm() {
    const { data, setData, post, processing, errors, reset } = useForm({
        room_number: '',
        room_type: '',
        description: '',
        amenities: [],
        price_per_night: '',
        max_adults: 2,
        max_children: 0,
        status: 'active',
        photos: [],
    });

    function submit(e) {
        e.preventDefault();

        post(route('admin.rooms.store'), {
            forceFormData: true,
            onSuccess: () => reset(),
        });
    }

    return (
        <form onSubmit={submit} className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-black">Add New Room</h2>

            <RoomFields data={data} setData={setData} errors={errors} />

            <button
                disabled={processing}
                className="mt-4 rounded-xl bg-blue-700 px-5 py-2 text-sm font-bold text-white hover:bg-blue-800"
            >
                {processing ? 'Saving...' : 'Add Room'}
            </button>
        </form>
    );
}

function RoomItem({ room, editing, onEdit }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        room_number: room.room_number,
        room_type: room.room_type,
        description: room.description || '',
        amenities: room.amenities || [],
        price_per_night: room.price_per_night,
        max_adults: room.max_adults,
        max_children: room.max_children,
        status: room.status,
        photos: [],
    });

    function update(e) {
        e.preventDefault();

        post(route('admin.rooms.update', room.id), {
            forceFormData: true,
        });
    }

    function destroyRoom() {
        if (!confirm('Delete this room and its photos?')) return;

        router.delete(route('admin.rooms.destroy', room.id));
    }

    const primaryPhoto = room.photos?.[0];

    return (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="grid md:grid-cols-[220px_1fr_auto]">
                <div className="h-40 bg-slate-900">
                    {primaryPhoto ? (
                        <img
                            src={`/storage/${primaryPhoto.image_path}`}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-sm text-white/70">
                            No photo
                        </div>
                    )}
                </div>

                <div className="p-4">
                    <h3 className="text-lg font-black text-slate-950">
                        {room.room_type}
                    </h3>
                    <p className="text-sm text-slate-500">
                        Room {room.room_number} • ${Number(room.price_per_night).toFixed(2)} / night
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                        {(room.amenities || []).map((amenity) => {
                            const found = amenityOptions.find(
                                ([key]) => key === amenity,
                            );

                            return (
                                <span
                                    key={amenity}
                                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold"
                                >
                                    {found?.[1] || amenity}
                                </span>
                            );
                        })}
                    </div>
                </div>

                <div className="flex flex-col justify-center gap-2 p-4">
    <button
        type="button"
        onClick={onEdit}
        className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-bold text-white hover:bg-blue-800"
    >
        {editing ? 'Close Editor' : 'Edit Room'}
    </button>

    <button
        type="button"
        onClick={destroyRoom}
        className="rounded-lg bg-red-700 px-4 py-2 text-sm font-bold text-white hover:bg-red-800"
    >
        Delete Room
    </button>
</div>
            </div>

            {editing && (
                <form onSubmit={update} className="border-t bg-slate-50 p-5">
                    <RoomFields data={data} setData={setData} errors={errors} />

                    <button
                        disabled={processing}
                        className="mt-4 rounded-xl bg-blue-700 px-5 py-2 text-sm font-bold text-white hover:bg-blue-800"
                    >
                        {processing ? 'Updating...' : 'Save Changes'}
                    </button>
                </form>
            )}
        </div>
    );
}

function RoomFields({ data, setData, errors }) {
    function toggleAmenity(value) {
        if (data.amenities.includes(value)) {
            setData(
                'amenities',
                data.amenities.filter((item) => item !== value),
            );
        } else {
            setData('amenities', [...data.amenities, value]);
        }
    }

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <Input
                label="Room Number"
                value={data.room_number}
                error={errors.room_number}
                onChange={(e) => setData('room_number', e.target.value)}
            />

            <Input
                label="Room Type"
                value={data.room_type}
                error={errors.room_type}
                onChange={(e) => setData('room_type', e.target.value)}
            />

            <Input
                label="Price Per Night ($)"
                type="number"
                value={data.price_per_night}
                error={errors.price_per_night}
                onChange={(e) => setData('price_per_night', e.target.value)}
            />

            <Input
                label="Max Adults"
                type="number"
                value={data.max_adults}
                error={errors.max_adults}
                onChange={(e) => setData('max_adults', e.target.value)}
            />

            <Input
                label="Max Children"
                type="number"
                value={data.max_children}
                error={errors.max_children}
                onChange={(e) => setData('max_children', e.target.value)}
            />

            <label>
                <span className="text-sm font-bold text-slate-700">Status</span>
                <select
                    value={data.status}
                    onChange={(e) => setData('status', e.target.value)}
                    className="mt-1 w-full rounded-xl border-slate-200 text-sm"
                >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="maintenance">Maintenance</option>
                </select>
            </label>

            <label className="md:col-span-2">
                <span className="text-sm font-bold text-slate-700">
                    Description
                </span>
                <textarea
                    rows="3"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    className="mt-1 w-full rounded-xl border-slate-200 text-sm"
                />
            </label>

            <div className="md:col-span-2">
                <p className="mb-2 text-sm font-bold text-slate-700">
                    Amenities
                </p>
                <div className="flex flex-wrap gap-2">
                    {amenityOptions.map(([value, label]) => (
                        <button
                            type="button"
                            key={value}
                            onClick={() => toggleAmenity(value)}
                            className={
                                data.amenities.includes(value)
                                    ? 'rounded-full bg-blue-700 px-3 py-2 text-sm font-bold text-white'
                                    : 'rounded-full bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700'
                            }
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <label className="md:col-span-2">
                <span className="text-sm font-bold text-slate-700">
                    Room Photos
                </span>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setData('photos', e.target.files)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-sm"
                />
            </label>
        </div>
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
