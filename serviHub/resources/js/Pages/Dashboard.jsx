import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from "@inertiajs/react";

export default function Dashboard({ auth }) {
    const isBusiness =
        auth.user.role === "business_admin" || auth.user.role === "staff";
    const isClient = auth.user.role === "client";

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium mb-4">
                                Welcome back, {auth.user.name}!
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {isBusiness && (
                                    <>
                                        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-6">
                                            <h4 className="font-semibold text-indigo-700">
                                                Manage Services
                                            </h4>
                                            <p className="text-sm text-indigo-600 mt-2">
                                                Add or edit services you offer.
                                            </p>
                                            <Link
                                                href={route("services.index")}
                                                className="mt-4 inline-block text-sm font-medium text-indigo-700 hover:text-indigo-900"
                                            >
                                                Go to Services &rarr;
                                            </Link>
                                        </div>
                                        <div className="bg-green-50 border border-green-100 rounded-lg p-6">
                                            <h4 className="font-semibold text-green-700">
                                                Manage Staff
                                            </h4>
                                            <p className="text-sm text-green-600 mt-2">
                                                Manage your team members.
                                            </p>
                                            <Link
                                                href={route("staff.index")}
                                                className="mt-4 inline-block text-sm font-medium text-green-700 hover:text-green-900"
                                            >
                                                Go to Staff &rarr;
                                            </Link>
                                        </div>
                                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
                                            <h4 className="font-semibold text-blue-700">
                                                Your Bookings
                                            </h4>
                                            <p className="text-sm text-blue-600 mt-2">
                                                View upcoming appointments.
                                            </p>
                                            <Link
                                                href={route("bookings.index")}
                                                className="mt-4 inline-block text-sm font-medium text-blue-700 hover:text-blue-900"
                                            >
                                                View Bookings &rarr;
                                            </Link>
                                        </div>
                                    </>
                                )}

                                {isClient && (
                                    <>
                                        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-6">
                                            <h4 className="font-semibold text-indigo-700">
                                                Browse Marketplace
                                            </h4>
                                            <p className="text-sm text-indigo-600 mt-2">
                                                Find active businesses near you.
                                            </p>
                                            <Link
                                                href={route(
                                                    "marketplace.index",
                                                )}
                                                className="mt-4 inline-block text-sm font-medium text-indigo-700 hover:text-indigo-900"
                                            >
                                                Go to Marketplace &rarr;
                                            </Link>
                                        </div>
                                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
                                            <h4 className="font-semibold text-blue-700">
                                                My Appointments
                                            </h4>
                                            <p className="text-sm text-blue-600 mt-2">
                                                View your scheduled bookings.
                                            </p>
                                            <Link
                                                href={route("bookings.index")}
                                                className="mt-4 inline-block text-sm font-medium text-blue-700 hover:text-blue-900"
                                            >
                                                View Bookings &rarr;
                                            </Link>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
