import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DataTable from '@/Components/UI/DataTable';
import DeleteConfirmModal from '@/Components/UI/DeleteConfirmModal';
import { useState } from 'react';

export default function EnrollmentIndex({ enrollments }) {
    const [deleteTarget, setDeleteTarget] = useState(null);

    return (
        <AuthenticatedLayout>
            <Head title="Enrollments" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Enrollments</h1>
                        <p className="text-sm text-gray-500 mt-1">View and manage student enrollments across semesters.</p>
                    </div>
                </div>

                {enrollments.data.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <i className="fa-solid fa-user-graduate text-2xl"></i>
                        </div>
                        <p className="text-gray-500">No enrollments yet.</p>
                    </div>
                ) : (
                    <DataTable
                        rows={enrollments.data}
                        searchableKeys={['student.name', 'semester.name', 'status']}
                        defaultSort={{ key: 'joined_at', dir: 'desc' }}
                        searchPlaceholder="Search students, semesters…"
                        emptyText="No enrollments match your search."
                        columns={[
                            { key: 'student.name', label: 'Student', sortable: true },
                            { key: 'semester.name', label: 'Semester', sortable: true },
                            { key: 'status', label: 'Status', sortable: true },
                            { key: 'joined_at', label: 'Joined', sortable: true },
                            { key: 'actions', label: 'Actions', align: 'right' },
                        ]}
                        renderCell={(key, row) => {
                            if (key === 'student.name') {
                                return <span className="font-medium text-gray-900">{row.student?.name}</span>;
                            }
                            if (key === 'status') {
                                return (
                                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${row.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {row.status}
                                    </span>
                                );
                            }
                            if (key === 'joined_at') {
                                return <span className="text-xs text-gray-600">{row.joined_at ? new Date(row.joined_at).toLocaleDateString() : '-'}</span>;
                            }
                            if (key === 'actions') {
                                return (
                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => setDeleteTarget(row)}
                                            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <i className="fa-solid fa-trash text-xs"></i> Remove
                                        </button>
                                    </div>
                                );
                            }
                        }}
                    />
                )}

                <DeleteConfirmModal
                    show={deleteTarget !== null}
                    onClose={() => setDeleteTarget(null)}
                    name={deleteTarget ? `${deleteTarget.student?.name} from ${deleteTarget.semester?.name}` : ''}
                    href={deleteTarget ? route('admin.enrollments.remove', { semester: deleteTarget.semester_id, student: deleteTarget.student_id }) : null}
                />
            </div>
        </AuthenticatedLayout>
    );
}
