import MarketplaceLayout from '@/Layouts/MarketplaceLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import BookingModal from '@/Components/BookingModal'; // We'll create this next

export default function Show({ business }) {
    const [selectedService, setSelectedService] = useState(null);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    const openBooking = (service) => {
        setSelectedService(service);
        setIsBookingModalOpen(true);
    };

    const closeBooking = () => {
        setIsBookingModalOpen(false);
        setSelectedService(null);
    };

    return (
        <MarketplaceLayout>
            <Head title={business.name} />

            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"> // Increased Header padding
                    <div className="md:flex md:items-center md:justify-between">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-3xl font-bold leading-7 text-gray-900 sm:text-4xl sm:truncate"> // Larger Title
                                {business.name}
                            </h2>
                        </div>
                        {business.logo_path && (
                             <div className="mt-4 flex md:mt-0 md:ml-4">
                                <img className="h-20 w-auto rounded-full" src={`/storage/${business.logo_path}`} alt="" /> // Larger Logo
                             </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Our Services</h3>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {business.services.map((service) => (
                        <div key={service.id} className="bg-white overflow-hidden shadow rounded-lg border border-gray-100 hover:shadow-md transition">
                            <div className="px-4 py-5 sm:p-6">
                                <div className="flex justify-between items-start">
                                     <h4 className="text-lg font-medium text-gray-900">{service.name}</h4>
                                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        ${service.price}
                                     </span>
                                </div>
                                <p className="mt-2 text-sm text-gray-500 line-clamp-3">
                                    {service.description || 'No description available.'}
                                </p>
                                <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                                    <span>{service.duration_minutes} mins</span>
                                    <button
                                        onClick={() => openBooking(service)}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-6">Meet Our Staff</h3>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                         {business.staff.map((member) => (
                            <div key={member.id} className="bg-white text-center rounded-lg shadow p-6">
                                <div className="space-y-4">
                                     {member.avatar_path ? (
                                        <img className="mx-auto h-24 w-24 rounded-full" src={`/storage/${member.avatar_path}`} alt="" />
                                     ) : (
                                        <div className="mx-auto h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-2xl font-bold">
                                            {member.name.charAt(0)}
                                        </div>
                                     )}
                                     <div className="space-y-2">
                                         <div className="text-lg leading-6 font-medium space-y-1">
                                             <h3>{member.name}</h3>
                                             <p className="text-indigo-600 text-sm">Staff Member</p>
                                         </div>
                                     </div>
                                </div>
                            </div>
                         ))}
                    </div>
                </div>

            </div>

            {selectedService && (
                <BookingModal 
                    isOpen={isBookingModalOpen} 
                    closeModal={closeBooking} 
                    service={selectedService} 
                    staffList={business.staff} 
                />
            )}
        </MarketplaceLayout>
    );
}
