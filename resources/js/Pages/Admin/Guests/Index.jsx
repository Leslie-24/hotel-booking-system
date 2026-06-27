import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function GuestsIndex({ auth, guests }) {
    const [search, setSearch] = useState('');

    const filteredGuests = useMemo(() => {
        const keyword = search.toLowerCase();

        return guests.filter((guest) => {
            return (
                guest.guest_name?.toLowerCase().includes(keyword) ||
                guest.guest_email?.toLowerCase().includes(keyword) ||
                guest.guest_phone?.toLowerCase().includes(keyword)
            );
        });
    }, [guests, search]);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Guest History" />

            <main className="min-h-screen bg-slate-100 px-4 py-6">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-5 rounded-2xl bg-slate-950 p-5 text-white">
                        <h1 className="text-2xl font-black">Guest History</h1>
                        <p className="text-sm text-slate-300">
                            View returning guests, total stays, and total spending.
                        </p>
                    </div>

                    <div className="mb-5 rounded-2xl bg-white p-4 shadow-sm">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by guest name, email, or phone..."
                            className="w-full rounded-xl border-slate-200 text-sm"
                        />
                    </div>

                    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                                    <tr>
                                        <th className="px-4 py-3">Guest</th>
                                        <th className="px-4 py-3">Contact</th>
                                        <th className="px-4 py-3">Total Stays</th>
                                        <th className="px-4 py-3">Total Spent</th>
                                        <th className="px-4 py-3">Last Stay</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredGuests.length > 0 ? (
                                        filteredGuests.map((guest) => (
                                            <tr
                                                key={guest.guest_key}
                                                className="border-t border-slate-100"
                                            >
                                                <td className="px-4 py-4 font-bold text-slate-900">
                                                    {guest.guest_name}
                                                </td>

                                                <td className="px-4 py-4 text-slate-600">
                                                    <p>{guest.guest_email || 'No email'}</p>
                                                    <p>{guest.guest_phone}</p>
                                                </td>

                                                <td className="px-4 py-4 font-black text-blue-700">
                                                    {guest.total_stays}
                                                </td>

                                                <td className="px-4 py-4 font-black text-green-700">
                                                    ${Number(guest.total_spent || 0).toFixed(2)}
                                                </td>

                                                <td className="px-4 py-4 text-slate-600">
                                                    {guest.last_stay || '—'}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="px-4 py-10 text-center text-slate-500"
                                            >
                                                No guests found.
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
