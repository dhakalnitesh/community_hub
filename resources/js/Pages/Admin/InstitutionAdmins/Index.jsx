import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Head } from '@inertiajs/react';

export default function Index() {
    return (
        <SuperAdminLayout activeItem="Institution Admins">
            <Head title="Institution Admins" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200 flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                            <i className="fa-solid fa-user-shield"></i>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Institution Admins Management</h3>
                            <p className="text-sm text-gray-500">
                                This page is currently under construction. Here you will be able to manage institution administrators, assign them to institutions, and monitor their activities.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </SuperAdminLayout>
    );
}
