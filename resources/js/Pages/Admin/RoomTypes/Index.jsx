import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

const amenityOptions = [
    ['wifi', 'WiFi'],
    ['breakfast', 'Breakfast'],
    ['pool', 'Pool'],
    ['parking', 'Parking'],
    ['tv', 'Smart TV'],
    ['ac', 'Air Conditioning'],
];

export default function RoomTypesIndex({ auth, roomTypes }) {
    const [editingId, setEditingId] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Room Types" />

            <main className="min-h-screen bg-slate-100 px-4 py-6">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-5 rounded-2xl bg-slate-950 p-5 text-white">
                        <h1 className="text-2xl font-black">Room Types</h1>
                        <p className="text-sm text-slate-300">
                            Manage room categories, inventory, amenities, room numbers, and photos.
                        </p>
                    </div>

                    <div className="mb-5 rounded-2xl bg-white p-5 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="text-lg font-black text-slate-950">
                                    Room Type Inventory
                                </h2>
                                <p className="text-sm text-slate-500">
                                    Add a room type only when creating a new category.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowCreateForm(!showCreateForm)}
                                className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white hover:bg-blue-800"
                            >
                                {showCreateForm ? 'Hide Form' : '+ Add Room Type'}
                            </button>
                        </div>
                    </div>

                    <div
                        className={`overflow-hidden transition-all duration-300 ${
                            showCreateForm
                                ? 'mb-6 max-h-[2500px] opacity-100'
                                : 'max-h-0 opacity-0'
                        }`}
                    >
                        <CreateRoomTypeForm
                            onCreated={() => setShowCreateForm(false)}
                        />
                    </div>

                    <div className="space-y-4">
                        {roomTypes.length > 0 ? (
                            roomTypes.map((roomType) => (
                                <RoomTypeCard
                                    key={roomType.id}
                                    roomType={roomType}
                                    editing={editingId === roomType.id}
                                    onEdit={() =>
                                        setEditingId(
                                            editingId === roomType.id
                                                ? null
                                                : roomType.id,
                                        )
                                    }
                                />
                            ))
                        ) : (
                            <div className="rounded-2xl bg-white p-8 text-center text-slate-500 shadow-sm">
                                No room types yet. Click “Add Room Type” to create one.
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </AuthenticatedLayout>
    );
}

function CreateRoomTypeForm({ onCreated }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
        amenities: [],
        price_per_night: '',
        max_adults: 2,
        max_children: 0,
        total_rooms: 1,
        status: 'active',
        photos: [],
    });

    function submit(e) {
        e.preventDefault();

        post(route('admin.room-types.store'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onCreated();
            },
        });
    }

    return (
        <form onSubmit={submit} className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-black">Add New Room Type</h2>

            <RoomTypeFields data={data} setData={setData} errors={errors} />

            <button
                disabled={processing}
                className="mt-4 rounded-xl bg-blue-700 px-5 py-2 text-sm font-bold text-white hover:bg-blue-800"
            >
                {processing ? 'Saving...' : 'Add Room Type'}
            </button>
        </form>
    );
}

function RoomTypeCard({ roomType, editing, onEdit }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        name: roomType.name,
        description: roomType.description || '',
        amenities: roomType.amenities || [],
        price_per_night: roomType.price_per_night,
        max_adults: roomType.max_adults,
        max_children: roomType.max_children,
        total_rooms: roomType.total_rooms,
        status: roomType.status,
        photos: [],
    });

    function update(e) {
        e.preventDefault();

        post(route('admin.room-types.update', roomType.id), {
            forceFormData: true,
            preserveScroll: true,
        });
    }

    function destroyRoomType() {
        if (!confirm('Delete this room type and all its photos?')) return;

        router.delete(route('admin.room-types.destroy', roomType.id), {
            preserveScroll: true,
        });
    }

    const primaryPhoto = roomType.photos?.[0];

    return (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="grid md:grid-cols-[220px_1fr_auto]">
                <div className="h-40 overflow-hidden bg-slate-900">
                    {primaryPhoto ? (
                        <img
                            src={`/storage/${primaryPhoto.image_path}`}
                            alt={roomType.name}
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
                        {roomType.name}
                    </h3>

                    <p className="text-sm text-slate-500">
                        {roomType.total_rooms} total rooms • $
                        {Number(roomType.price_per_night).toFixed(2)} / night
                    </p>

                    <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                        {roomType.description || 'No description yet.'}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                        {(roomType.amenities || []).map((amenity) => {
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

                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-600">
                        <span>Adults: {roomType.max_adults}</span>
                        <span>Children: {roomType.max_children}</span>
                        <span>Status: {roomType.status}</span>
                        <span>Units: {roomType.units?.length || 0}</span>
                    </div>
                </div>

                <div className="flex flex-col justify-center gap-2 p-4">
                    <button
                        type="button"
                        onClick={onEdit}
                        className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-bold text-white hover:bg-blue-800"
                    >
                        {editing ? 'Close Editor' : 'Edit Type'}
                    </button>

                    <button
                        type="button"
                        onClick={destroyRoomType}
                        className="rounded-lg bg-red-700 px-4 py-2 text-sm font-bold text-white hover:bg-red-800"
                    >
                        Delete
                    </button>
                </div>
            </div>

            {editing && (
                <form onSubmit={update} className="border-t bg-slate-50 p-5">
                    <RoomTypeFields
                        data={data}
                        setData={setData}
                        errors={errors}
                    />

                    <RoomUnitsManager roomType={roomType} />

                    <ExistingPhotos roomType={roomType} />

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

function RoomUnitsManager({ roomType }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        room_type_id: roomType.id,
        room_number: '',
        status: 'active',
    });

    function submit() {
        post(route('admin.room-units.store'), {
            preserveScroll: true,
            onSuccess: () => reset('room_number', 'status'),
        });
    }

    function deleteUnit(id) {
        if (!confirm('Delete this room number?')) return;

        router.delete(route('admin.room-units.destroy', id), {
            preserveScroll: true,
        });
    }

    return (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
            <h4 className="text-sm font-black text-slate-800">
                Actual Room Numbers
            </h4>

            <p className="mt-1 text-xs text-slate-500">
                Add physical room numbers. You can enter one room, comma-separated rooms, or a range like 101-150.
            </p>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
                <label>
                    <span className="text-xs font-bold text-slate-600">
                        Room Number(s)
                    </span>
                    <input
                        type="text"
                        value={data.room_number}
                        placeholder="101 or 101,102 or 101-150"
                        onChange={(e) =>
                            setData('room_number', e.target.value)
                        }
                        className="mt-1 w-full rounded-xl border-slate-200 text-sm"
                    />
                    {errors.room_number && (
                        <p className="mt-1 text-xs text-red-600">
                            {errors.room_number}
                        </p>
                    )}
                </label>

                <label>
                    <span className="text-xs font-bold text-slate-600">
                        Status
                    </span>
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

                <div className="flex items-end">
                    <button
                        type="button"
                        disabled={processing}
                        onClick={submit}
                        className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white hover:bg-blue-800"
                    >
                        {processing ? 'Adding...' : 'Add Room Number(s)'}
                    </button>
                </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                {roomType.units?.length > 0 ? (
                    roomType.units.map((unit) => (
                        <div
                            key={unit.id}
                            className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700"
                        >
                            <span>Room {unit.room_number}</span>
                            <span className="text-slate-400">•</span>
                            <span>{unit.status}</span>

                            <button
                                type="button"
                                onClick={() => deleteUnit(unit.id)}
                                className="ml-2 rounded-full bg-red-100 px-2 py-1 text-red-700 hover:bg-red-200"
                            >
                                Delete
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-slate-500">
                        No room numbers added yet.
                    </p>
                )}
            </div>
        </div>
    );
}

function ExistingPhotos({ roomType }) {
    return (
        <div className="mt-5">
            <h4 className="mb-3 text-sm font-black text-slate-700">
                Existing Photos
            </h4>

            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                {roomType.photos?.length > 0 ? (
                    roomType.photos.map((photo) => (
                        <div
                            key={photo.id}
                            className="overflow-hidden rounded-2xl border bg-white"
                        >
                            <img
                                src={`/storage/${photo.image_path}`}
                                alt={roomType.name}
                                className="h-28 w-full object-cover"
                            />

                            <div className="space-y-2 p-2">
                                <div className="text-xs font-bold text-slate-600">
                                    {photo.is_primary
                                        ? 'Main display photo'
                                        : 'Gallery photo'}
                                </div>

                                {!photo.is_primary && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            router.patch(
                                                route(
                                                    'admin.room-type-photos.primary',
                                                    photo.id,
                                                ),
                                                {},
                                                { preserveScroll: true },
                                            )
                                        }
                                        className="w-full rounded-lg bg-blue-700 px-3 py-2 text-xs font-bold text-white hover:bg-blue-800"
                                    >
                                        Set as Main
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={() => {
                                        if (!confirm('Delete this photo?')) return;

                                        router.delete(
                                            route(
                                                'admin.room-type-photos.destroy',
                                                photo.id,
                                            ),
                                            { preserveScroll: true },
                                        );
                                    }}
                                    className="w-full rounded-lg bg-red-700 px-3 py-2 text-xs font-bold text-white hover:bg-red-800"
                                >
                                    Delete Photo
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-slate-500">
                        No photos uploaded yet.
                    </p>
                )}
            </div>
        </div>
    );
}

function RoomTypeFields({ data, setData, errors }) {
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
                label="Room Type Name"
                value={data.name}
                error={errors.name}
                onChange={(e) => setData('name', e.target.value)}
            />

            <Input
                label="Price Per Night ($)"
                type="number"
                value={data.price_per_night}
                error={errors.price_per_night}
                onChange={(e) => setData('price_per_night', e.target.value)}
            />

            <Input
                label="Total Rooms Available"
                type="number"
                value={data.total_rooms}
                error={errors.total_rooms}
                onChange={(e) => setData('total_rooms', e.target.value)}
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
                                    : 'rounded-full bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200'
                            }
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <label className="md:col-span-2">
                <span className="text-sm font-bold text-slate-700">
                    Add Photos
                </span>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setData('photos', e.target.files)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-sm"
                />
                <p className="mt-1 text-xs text-slate-500">
                    First uploaded photo becomes the main display photo. Extra photos appear in the expanded gallery.
                </p>
                {errors.photos && (
                    <p className="mt-1 text-xs text-red-600">
                        {errors.photos}
                    </p>
                )}
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
