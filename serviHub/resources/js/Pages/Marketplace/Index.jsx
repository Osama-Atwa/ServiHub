import MarketplaceLayout from '@/Layouts/MarketplaceLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ businesses }) {
    return (
        <MarketplaceLayout>
            <Head title="Marketplace" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Discover Local Businesses
                        </h2>
                        <p className="mt-4 text-xl text-gray-500">
                            Find the best services near you.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                        {businesses.map((business) => (
                            <Link key={business.id} href={route('marketplace.business.show', business.slug)} className="group">
                                <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
                                    {business.logo_path ? (
                                         <img
                                            src={`/storage/${business.logo_path}`}
                                            alt={business.name}
                                            className="w-full h-full object-center object-cover group-hover:opacity-75"
                                        />
                                    ) : (
                                        <div className="w-full h-48 bg-indigo-100 flex items-center justify-center text-indigo-500 font-bold text-2xl group-hover:bg-indigo-200 transition">
                                            {business.name.substring(0, 1)}
                                        </div>
                                    )}
                                </div>
                                <h3 className="mt-4 text-lg font-medium text-gray-900">{business.name}</h3>
                                {business.brand_color && (
                                     <div className="mt-1 flex items-center text-sm text-gray-500">
                                        <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: business.brand_color }}></span>
                                        Brand Color
                                     </div>
                                )}
                            </Link>
                        ))}
                    </div>

                    {businesses.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">No businesses found yet. Be the first to join!</p>
                            <Link href={route('register.business')} className="mt-4 inline-block text-indigo-600 hover:text-indigo-500 font-medium">
                                Register your business &rarr;
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </MarketplaceLayout>
    );
}
