import { Head } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import DataTable from '@/Components/UI/DataTable';

export default function SpamLogs({ logs }) {
    return (
        <SuperAdminLayout activeItem="Spam Logs">
            <Head title="Spam Logs" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Spam Logs</h1>
                        <p className="text-sm text-gray-500 mt-1">Events flagged by the spam detection system.</p>
                    </div>
                </div>

                <DataTable
                    rows={logs.data || []}
                    searchableKeys={['event_type', 'uuid']}
                    defaultSort={{ key: 'created_at', dir: 'desc' }}
                    searchPlaceholder="Search events or UUIDs…"
                    emptyText="No spam logs found."
                    columns={[
                        { key: 'event_type', label: 'Event', sortable: true },
                        { key: 'uuid', label: 'UUID' },
                        { key: 'spam_score', label: 'Score', sortable: true },
                        { key: 'created_at', label: 'Date', sortable: true },
                    ]}
                    renderCell={(key, row) => {
                        if (key === 'uuid') {
                            return <span className="font-mono text-xs text-gray-500">{row.uuid || '—'}</span>;
                        }
                        if (key === 'spam_score') {
                            return row.spam_score !== null ? (
                                <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium ${row.spam_score > 0.7 ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
                                    {row.spam_score.toFixed(2)}
                                </span>
                            ) : (
                                <span className="text-xs text-gray-400">—</span>
                            );
                        }
                        if (key === 'created_at') {
                            return <span className="text-xs text-gray-500">{new Date(row.created_at).toLocaleDateString()}</span>;
                        }
                    }}
                />
            </div>
        </SuperAdminLayout>
    );
}
