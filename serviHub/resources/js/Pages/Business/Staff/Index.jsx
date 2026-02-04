import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import { useState } from 'react';

export default function Index({ auth, staff }) {
    const [confirmingStaffCreation, setConfirmingStaffCreation] = useState(false);
    
    // Form now includes fields needed for creating a user and linking them as staff
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        bio: '',
    });

    const confirmStaffCreation = () => {
        setConfirmingStaffCreation(true);
    };

    const closeModal = () => {
        setConfirmingStaffCreation(false);
        reset();
    };

    const createStaff = (e) => {
        e.preventDefault();
        post(route('staff.store'), {
            onSuccess: () => closeModal(),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">My Staff</h2>}
        >
            <Head title="Staff" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium">Manage Team</h3>
                                <PrimaryButton onClick={confirmStaffCreation}>
                                    Add New Staff
                                </PrimaryButton>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {staff.map((member) => (
                                    <div key={member.id} className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 font-bold text-lg">
                                                {member.name.charAt(0)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {member.name}
                                                </p>
                                                <p className="text-sm text-gray-500 truncate">
                                                    {member.user?.email}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {member.bio || 'No bio available.'}
                                            </p>
                                        </div>
                                        <div className="mt-4 flex justify-end space-x-3">
                                            <button className="text-sm text-indigo-600 hover:text-indigo-900 font-medium">Edit</button>
                                            <button className="text-sm text-red-600 hover:text-red-900 font-medium">Remove</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={confirmingStaffCreation} onClose={closeModal}>
                <form onSubmit={createStaff} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Add New Staff Member
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        This will create a new user account for the staff member.
                    </p>

                    <div className="mt-6">
                        <InputLabel htmlFor="name" value="Full Name" />
                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="mt-1 block w-full"
                            isFocused
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="mt-6">
                        <InputLabel htmlFor="email" value="Email Address" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="mt-1 block w-full"
                            required
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div className="mt-6">
                        <InputLabel htmlFor="bio" value="Bio (Optional)" />
                        <TextInput
                            id="bio"
                            name="bio"
                            value={data.bio}
                            onChange={(e) => setData('bio', e.target.value)}
                            className="mt-1 block w-full"
                        />
                        <InputError message={errors.bio} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>
                        <PrimaryButton className="ml-3" disabled={processing}>
                            Add Staff
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
