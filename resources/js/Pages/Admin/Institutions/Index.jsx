import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import DataTable from '@/Components/UI/DataTable';

export default function Index({ institutions, totalInstitutions }) {
    return (
        <AuthenticatedLayout>
            <Head title="Admin - Institutions List" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Institution Management</h1>
                        <p className="text-sm text-gray-500 mt-1">View and manage all registered institutions on the platform.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="inline-flex px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-xs font-semibold">
                            Total Institutions: {totalInstitutions}
                        </span>
                        <Link href={route('admin.institutions.create')} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                            <i className="fa-solid fa-plus text-xs"></i> Add Institution
                        </Link>
                    </div>
                </div>

                <DataTable
                    rows={institutions.data || []}
                    searchableKeys={['name', 'address']}
                    defaultSort={{ key: 'name', dir: 'asc' }}
                    searchPlaceholder="Search by name or address…"
                    emptyText="No institutions found."
                    columns={[
                        { key: 'institution', label: 'Institution', sortable: true },
                        { key: 'type', label: 'Type', sortable: true },
                        { key: 'address', label: 'Address' },
                        { key: 'admin', label: 'Admin' },
                        { key: 'created_at', label: 'Created At', sortable: true },
                    ]}
                    renderCell={(key, row) => {
                        if (key === 'institution') {
                            return (
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center shrink-0">
                                        {row.name.charAt(0).toUpperCase()}
                                    </div>
                                    <p className="font-semibold text-gray-900">{row.name}</p>
                                </div>
                            );
                        }
                        if (key === 'type') {
                            return (
                                <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium border bg-gray-100 text-gray-700 border-gray-200 capitalize">
                                    {row.type}
                                </span>
                            );
                        }
                        if (key === 'admin') {
                            const admin = row.users?.[0];
                            return admin ? (
                                <div>
                                    <p className="text-gray-900 font-medium text-xs">{admin.name}</p>
                                    <p className="text-gray-500 text-[11px]">{admin.email}</p>
                                </div>
                            ) : (
                                <span className="text-gray-400 italic text-xs">No Admin assigned</span>
                            );
                        }
                        if (key === 'created_at') {
                            return (
                                <span className="text-xs text-gray-600">
                                    {new Date(row.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                </span>
                            );
                        }
                    }}
                />
            </div>
        </AuthenticatedLayout>
    );
}
