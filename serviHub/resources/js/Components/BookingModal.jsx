import Modal from '@/Components/Modal';
import { useForm } from '@inertiajs/react'; // Correct import
import { useState, useEffect } from 'react';
import axios from 'axios';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton'; // Check if this exists, maybe PrimaryButton
import SecondaryButton from '@/Components/SecondaryButton'; // Check if this exists

export default function BookingModal({ isOpen, closeModal, service, staffList }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        service_id: service?.id,
        staff_id: '',
        date: '',
        time_slot: '',
    });

    const [availableSlots, setAvailableSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);

    useEffect(() => {
        setData('service_id', service?.id);
        setData('staff_id', '');
        setData('date', '');
        setData('time_slot', '');
        setAvailableSlots([]);
    }, [service]);

    useEffect(() => {
        if (data.service_id && data.date) {
            fetchSlots();
        }
    }, [data.service_id, data.staff_id, data.date]);

    const fetchSlots = async () => {
        setLoadingSlots(true);
        try {
            const response = await axios.get(route('availability.check'), { // Ensure route exists to accept query params
                params: {
                    service_id: data.service_id,
                    staff_id: data.staff_id,
                    date: data.date,
                }
            });
            setAvailableSlots(response.data.slots);
        } catch (error) {
            console.error("Failed to fetch slots", error);
            setAvailableSlots([]);
        } finally {
            setLoadingSlots(false);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        
        post(route('bookings.store'), {
            data: { // transform data to match controller expectation
                service_id: data.service_id,
                staff_id: data.staff_id,
                start_time: `${data.date} ${data.time_slot}`, // Combine date and time
            },
            onSuccess: () => {
                closeModal();
                reset();
            },
        });
    };
    
    // Custom transform for the form data submission because controller expects 'start_time'
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('bookings.store'), {
            // We need to manually construct the data because useForm's default behavior sends 'data' object
            // But here we need to transform it. 
            // Actually, best way is to set 'start_time' in data before post, but date and time are separate in UI.
            // Let's modify the useForm data or pass specific data to post?
            // Inertia 'post' takes options. To send specific data, we should probably update state first or use transform.
            transform: (data) => ({
                service_id: data.service_id,
                staff_id: data.staff_id,
                start_time: `${data.date} ${data.time_slot}`,
            }),
            onSuccess: () => {
                closeModal();
                reset();
            }
        });
    };


    if (!service) return null;

    return (
        <Modal show={isOpen} onClose={closeModal}>
            <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900">
                    Book {service.name}
                </h2>
                
                <p className="mt-1 text-sm text-gray-600">
                    Duration: {service.duration_minutes} mins | Price: ${service.price}
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                    <div>
                        <InputLabel htmlFor="staff_id" value="Select Staff (Optional)" />
                        <select
                            id="staff_id"
                            name="staff_id"
                            value={data.staff_id}
                            onChange={(e) => setData('staff_id', e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            required // Enforcing staff selection for MVP as per Controller
                        >
                            <option value="">Choose a staff member</option>
                            {staffList.map((staff) => (
                                <option key={staff.id} value={staff.id}>
                                    {staff.name}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.staff_id} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="date" value="Select Date" />
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={data.date}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => setData('date', e.target.value)}
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            required
                        />
                         <InputError message={errors.date} className="mt-2" />
                    </div>

                    {data.date && (
                         <div>
                            <InputLabel value="Available Time Slots" />
                            {loadingSlots ? (
                                <p className="text-sm text-gray-500 mt-2">Loading slots...</p>
                            ) : availableSlots.length > 0 ? (
                                <div className="grid grid-cols-3 gap-2 mt-2">
                                    {availableSlots.map((slot) => (
                                        <button
                                            key={slot}
                                            type="button"
                                            onClick={() => setData('time_slot', slot)}
                                            className={`px-3 py-2 text-sm font-medium rounded-md border ${
                                                data.time_slot === slot
                                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            {slot}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-red-500 mt-2">No slots available for this date.</p>
                            )}
                             <InputError message={errors.start_time || errors.time_slot} className="mt-2" />
                        </div>
                    )}

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>
                        <PrimaryButton className="ml-3" disabled={processing || !data.time_slot}>
                            Confirm Booking
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
