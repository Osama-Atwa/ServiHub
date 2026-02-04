import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from "@inertiajs/react";

export default function Dashboard({ auth, stats }) {
    const isBusiness =
        auth.user.role === "business_admin" || auth.user.role === "staff";
    const isClient = auth.user.role === "client";

    // Helper for Stat Cards
    const StatCard = ({ title, value, color, icon }) => (
        <div
            className={`bg-white overflow-hidden shadow rounded-lg border-l-4 border-${color}-500`}
        >
            <div className="p-5">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        {/* Simple colored circle as placeholder for icon */}
                        <div
                            className={`h-10 w-10 rounded-full bg-${color}-100 flex items-center justify-center text-${color}-600`}
                        >
                            <span className="font-bold text-lg">{icon}</span>
                        </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                                {title}
                            </dt>
                            <dd>
                                <div className="text-lg font-medium text-gray-900">
                                    {value}
                                </div>
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );

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
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    {/* Welcome Section */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-bold text-gray-800">
                                    Welcome back,{" "}
                                    <span className="text-indigo-600">
                                        {auth.user.name}
                                    </span>
                                    !
                                </h3>
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500 uppercase tracking-wide">
                                    {auth.user.role.replace("_", " ")}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Statistics Section */}
                    {stats && (
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            <StatCard
                                title="Total Bookings"
                                value={stats.total_bookings}
                                color="indigo"
                                icon="📅"
                            />
                            <StatCard
                                title="Upcoming"
                                value={stats.upcoming_bookings}
                                color="blue"
                                icon="⏳"
                            />
                            <StatCard
                                title={
                                    isClient ? "Total Spent" : "Total Revenue"
                                }
                                value={
                                    isClient
                                        ? `$${stats.total_spent}`
                                        : `$${stats.total_revenue}`
                                }
                                color="green"
                                icon="💰"
                            />
                        </div>
                    )}

                    {/* Popular Staff (Business Only) */}
                    {isBusiness &&
                        stats.popular_staff &&
                        stats.popular_staff.length > 0 && (
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                        Top Performing Staff
                                    </h4>
                                    <ul className="divide-y divide-gray-200">
                                        {stats.popular_staff.map(
                                            (staff, index) => (
                                                <li
                                                    key={index}
                                                    className="py-3 flex justify-between items-center"
                                                >
                                                    <span className="text-gray-700 font-medium">
                                                        {staff.name}
                                                    </span>
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                        {staff.bookings}{" "}
                                                        Bookings
                                                    </span>
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </div>
                            </div>
                        )}

                    {/* Quick Actions (Navigation) */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-6">
                                Quick Actions
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {isBusiness && (
                                    <>
                                        <Link
                                            href={route("services.index")}
                                            className="group block max-w-xs mx-auto rounded-lg p-6 bg-white ring-1 ring-slate-900/5 shadow-lg space-y-3 hover:bg-sky-500 hover:ring-sky-500 transition-all duration-300"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <h3 className="text-slate-900 group-hover:text-white text-sm font-semibold">
                                                    Manage Services
                                                </h3>
                                            </div>
                                            <p className="text-slate-500 group-hover:text-white text-sm">
                                                Add or edit services you offer.
                                            </p>
                                        </Link>

                                        <Link
                                            href={route("staff.index")}
                                            className="group block max-w-xs mx-auto rounded-lg p-6 bg-white ring-1 ring-slate-900/5 shadow-lg space-y-3 hover:bg-sky-500 hover:ring-sky-500 transition-all duration-300"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <h3 className="text-slate-900 group-hover:text-white text-sm font-semibold">
                                                    Manage Staff
                                                </h3>
                                            </div>
                                            <p className="text-slate-500 group-hover:text-white text-sm">
                                                Manage your team members and
                                                schedle.
                                            </p>
                                        </Link>

                                        <Link
                                            href={route("bookings.index")}
                                            className="group block max-w-xs mx-auto rounded-lg p-6 bg-white ring-1 ring-slate-900/5 shadow-lg space-y-3 hover:bg-sky-500 hover:ring-sky-500 transition-all duration-300"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <h3 className="text-slate-900 group-hover:text-white text-sm font-semibold">
                                                    View Bookings
                                                </h3>
                                            </div>
                                            <p className="text-slate-500 group-hover:text-white text-sm">
                                                Check your upcoming schedule.
                                            </p>
                                        </Link>
                                    </>
                                )}

                                {isClient && (
                                    <>
                                        <Link
                                            href={route("marketplace.index")}
                                            className="group block max-w-xs mx-auto rounded-lg p-6 bg-white ring-1 ring-slate-900/5 shadow-lg space-y-3 hover:bg-indigo-500 hover:ring-indigo-500 transition-all duration-300"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <h3 className="text-slate-900 group-hover:text-white text-sm font-semibold">
                                                    Browse Marketplace
                                                </h3>
                                            </div>
                                            <p className="text-slate-500 group-hover:text-white text-sm">
                                                Find active businesses near you.
                                            </p>
                                        </Link>

                                        <Link
                                            href={route("bookings.index")}
                                            className="group block max-w-xs mx-auto rounded-lg p-6 bg-white ring-1 ring-slate-900/5 shadow-lg space-y-3 hover:bg-indigo-500 hover:ring-indigo-500 transition-all duration-300"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <h3 className="text-slate-900 group-hover:text-white text-sm font-semibold">
                                                    My Appointments
                                                </h3>
                                            </div>
                                            <p className="text-slate-500 group-hover:text-white text-sm">
                                                View your scheduled bookings.
                                            </p>
                                        </Link>
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
