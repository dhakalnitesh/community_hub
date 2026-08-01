import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Create({ errors }) {
    const [formData, setFormData] = useState({
        name: '',
        type: 'college',
        address: '',
        admin_name: '',
        admin_email: '',
        admin_password: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(route('admin.institutions.store'), formData);
    };

    return (
        <SuperAdminLayout activeItem="Institutions">
            <Head title="Add Institution" />

            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Add New Institution</h1>
                        <p className="text-sm text-gray-500 mt-1">Create an institution and its administrator account.</p>
                    </div>
                    <Link href={route('admin.institutions')} className="text-sm text-indigo-600 hover:underline">
                        Back to Institutions
                    </Link>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-5 py-3.5 bg-slate-50 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900">Institution Details</h3>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div>
                            <InputLabel htmlFor="name" value="Institution Name" />
                            <TextInput id="name" name="name" value={formData.name} onChange={handleChange} required />
                            {errors?.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <InputLabel htmlFor="type" value="Type" />
                            <select
                                id="type"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full rounded-lg border-slate-300 px-3 py-1.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                <option value="school">School</option>
                                <option value="college">College</option>
                                <option value="university">University</option>
                                <option value="institute">Institute</option>
                            </select>
                            {errors?.type && <p className="text-xs text-red-600 mt-1">{errors.type}</p>}
                        </div>
                        <div>
                            <InputLabel htmlFor="address" value="Address" />
                            <TextInput id="address" name="address" value={formData.address} onChange={handleChange} required />
                            {errors?.address && <p className="text-xs text-red-600 mt-1">{errors.address}</p>}
                        </div>

                        <div className="pt-5 border-t border-gray-100">
                            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Institution Admin Account</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <InputLabel htmlFor="admin_name" value="Admin Full Name" />
                                    <TextInput id="admin_name" name="admin_name" value={formData.admin_name} onChange={handleChange} required />
                                    {errors?.admin_name && <p className="text-xs text-red-600 mt-1">{errors.admin_name}</p>}
                                </div>
                                <div>
                                    <InputLabel htmlFor="admin_email" value="Admin Email" />
                                    <TextInput id="admin_email" type="email" name="admin_email" value={formData.admin_email} onChange={handleChange} required />
                                    {errors?.admin_email && <p className="text-xs text-red-600 mt-1">{errors.admin_email}</p>}
                                </div>
                                <div className="sm:col-span-2">
                                    <InputLabel htmlFor="admin_password" value="Initial Password" />
                                    <TextInput id="admin_password" type="password" name="admin_password" value={formData.admin_password} onChange={handleChange} required minLength="8" />
                                    {errors?.admin_password && <p className="text-xs text-red-600 mt-1">{errors.admin_password}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                            <Link href={route('admin.institutions')} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                Cancel
                            </Link>
                            <PrimaryButton type="submit">
                                <i className="fa-solid fa-building-columns mr-2 text-xs"></i> Create Institution & Admin
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </SuperAdminLayout>
    );
}
