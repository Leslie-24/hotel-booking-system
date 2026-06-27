import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';

export default function UsersIndex({ auth, users }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'receptionist',
    });

    function submit(e) {
        e.preventDefault();

        post(route('admin.users.store'), {
            preserveScroll: true,
            onSuccess: () =>
                reset('name', 'email', 'password'),
        });
    }

    function deleteUser(id) {
        if (!confirm('Delete this user?')) return;

        router.delete(route('admin.users.destroy', id));
    }

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Staff Management" />

            <main className="min-h-screen bg-slate-100 px-4 py-6">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-5 rounded-2xl bg-slate-950 p-5 text-white">
                        <h1 className="text-2xl font-black">
                            Staff Management
                        </h1>

                        <p className="text-sm text-slate-300">
                            Create and manage administrator,
                            receptionist and manager accounts.
                        </p>
                    </div>

                    <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
                        <form
                            onSubmit={submit}
                            className="rounded-2xl bg-white p-5 shadow-sm"
                        >
                            <h2 className="mb-4 text-lg font-black">
                                Add Staff Member
                            </h2>

                            <Input
                                label="Full Name"
                                value={data.name}
                                error={errors.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                            />

                            <Input
                                label="Email"
                                type="email"
                                value={data.email}
                                error={errors.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                            />

                            <Input
                                label="Password"
                                type="password"
                                value={data.password}
                                error={errors.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                            />

                            <label className="block mt-4">
                                <span className="text-sm font-bold text-slate-700">
                                    Role
                                </span>

                                <select
                                    value={data.role}
                                    onChange={(e) =>
                                        setData('role', e.target.value)
                                    }
                                    className="mt-1 w-full rounded-xl border-slate-200"
                                >
                                    <option value="admin">Admin</option>
                                    <option value="receptionist">
                                        Receptionist
                                    </option>
                                    <option value="manager">
                                        Manager
                                    </option>
                                </select>
                            </label>

                            <button
                                disabled={processing}
                                className="mt-5 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white hover:bg-blue-800"
                            >
                                {processing
                                    ? 'Creating...'
                                    : 'Create Staff Account'}
                            </button>
                        </form>

                        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                            <div className="border-b border-slate-100 p-5">
                                <h2 className="text-lg font-black">
                                    Staff Members
                                </h2>
                            </div>

                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                                    <tr>
                                        <th className="px-4 py-3">
                                            Name
                                        </th>
                                        <th className="px-4 py-3">
                                            Email
                                        </th>
                                        <th className="px-4 py-3">
                                            Role
                                        </th>
                                        <th className="px-4 py-3">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {users.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="border-t border-slate-100"
                                        >
                                            <td className="px-4 py-3 font-bold">
                                                {user.name}
                                            </td>

                                            <td className="px-4 py-3">
                                                {user.email}
                                            </td>

                                            <td className="px-4 py-3">
                                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold">
                                                    {user.role}
                                                </span>
                                            </td>

                                            <td className="px-4 py-3">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        deleteUser(user.id)
                                                    }
                                                    className="rounded-lg bg-red-700 px-3 py-2 text-xs font-bold text-white hover:bg-red-800"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </AuthenticatedLayout>
    );
}

function Input({
    label,
    value,
    onChange,
    error,
    type = 'text',
}) {
    return (
        <label className="block mt-4">
            <span className="text-sm font-bold text-slate-700">
                {label}
            </span>

            <input
                type={type}
                value={value}
                onChange={onChange}
                className="mt-1 w-full rounded-xl border-slate-200"
            />

            {error && (
                <p className="mt-1 text-sm text-red-600">
                    {error}
                </p>
            )}
        </label>
    );
}
