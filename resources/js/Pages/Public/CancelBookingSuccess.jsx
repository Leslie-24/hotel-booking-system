import { Head, Link } from '@inertiajs/react';

export default function CancelBookingSuccess({ booking }) {
    return (
        <>
            <Head title="Booking Cancelled" />

            <main className="min-h-screen bg-slate-100 px-5 py-10">
                <div className="mx-auto max-w-xl rounded-3xl bg-white p-7 text-center shadow-sm">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl text-red-700">
                        ×
                    </div>

                    <h1 className="mt-5 text-2xl font-black text-slate-950">
                        Booking Cancelled
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Your booking has been cancelled successfully.
                    </p>

                    <p className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-700">
                        Reference: {booking.booking_reference}
                    </p>

                    <Link
                        href="/"
                        className="mt-6 inline-block rounded-full bg-blue-700 px-6 py-3 text-sm font-black text-white hover:bg-blue-800"
                    >
                        Back to Home
                    </Link>
                </div>
            </main>
        </>
    );
}
