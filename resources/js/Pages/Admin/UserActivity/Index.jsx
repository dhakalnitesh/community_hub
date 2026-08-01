import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DataTable from '@/Components/UI/DataTable';

function formatActionName(action) {
    if (!action) return 'Unknown Action';
    return action.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export default function Index({ activities }) {
    return (
        <AuthenticatedLayout>
            <Head title="Admin - User Activity" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">User Activity Logs</h1>
                        <p className="text-sm text-gray-500 mt-1">Track the latest activities and events triggered by users.</p>
                    </div>
                </div>

                <DataTable
                    rows={activities.data || []}
                    searchableKeys={['student.name', 'student.email', 'action', 'subject.name']}
                    defaultSort={{ key: 'created_at', dir: 'desc' }}
                    searchPlaceholder="Search by user name, email or action…"
                    emptyText="No recent activities found."
                    columns={[
                        { key: 'user', label: 'User' },
                        { key: 'action', label: 'Action' },
                        { key: 'subject.name', label: 'Subject' },
                        { key: 'created_at', label: 'Timestamp', sortable: true },
                    ]}
                    renderCell={(key, row) => {
                        if (key === 'user') {
                            return (
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-semibold text-xs flex items-center justify-center shrink-0">
                                        {row.student?.name ? row.student.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{row.student?.name || 'Unknown'}</p>
                                        <p className="text-xs text-gray-500">{row.student?.email || ''}</p>
                                    </div>
                                </div>
                            );
                        }
                        if (key === 'action') {
                            return (
                                <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border bg-indigo-50 text-indigo-700 border-indigo-200">
                                    {formatActionName(row.action)}
                                </span>
                            );
                        }
                        if (key === 'subject.name') {
                            return row.subject ? (
                                <span className="text-sm">{row.subject.name}</span>
                            ) : (
                                <span className="text-xs text-gray-400 italic">N/A</span>
                            );
                        }
                        if (key === 'created_at') {
                            return <span className="text-xs text-gray-600">{new Date(row.created_at).toLocaleString()}</span>;
                        }
                    }}
                />
            </div>
        </AuthenticatedLayout>
    );
}
