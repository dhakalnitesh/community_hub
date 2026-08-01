import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Head } from '@inertiajs/react';

export default function Index() {
    return (
        <SuperAdminLayout activeItem="Reports">
            <Head title="Reports" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200 flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                            <i className="fa-solid fa-file-lines"></i>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">System Reports</h3>
                            <p className="text-sm text-gray-500">
                                This page is currently under construction. Here you will be able to generate, view, and export various system-wide reports and metrics.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </SuperAdminLayout>
    );
}
