import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import DataTable from '@/Components/UI/DataTable';
import DeleteConfirmModal from '@/Components/UI/DeleteConfirmModal';
import { useState } from 'react';

export default function SubjectIndex({ subjects }) {
    const [deleteTarget, setDeleteTarget] = useState(null);

    return (
        <AuthenticatedLayout>
            <Head title="Subjects" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Subjects</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage subjects across your semesters and assign teachers.</p>
                    </div>
                    <Link href={route('admin.subjects.create')} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                        <i className="fa-solid fa-plus text-xs"></i> New Subject
                    </Link>
                </div>

                {subjects.data.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <i className="fa-solid fa-book text-2xl"></i>
                        </div>
                        <p className="text-gray-500">No subjects yet.</p>
                        <Link href={route('admin.subjects.create')} className="text-indigo-600 hover:text-indigo-800 text-sm mt-2 inline-block">
                            Create the first subject
                        </Link>
                    </div>
                ) : (
                    <DataTable
                        rows={subjects.data}
                        searchableKeys={['name', 'code', 'semester.name']}
                        defaultSort={{ key: 'name', dir: 'asc' }}
                        searchPlaceholder="Search subjects…"
                        emptyText="No subjects match your search."
                        columns={[
                            { key: 'name', label: 'Name', sortable: true },
                            { key: 'code', label: 'Code' },
                            { key: 'semester.name', label: 'Semester', sortable: true },
                            { key: 'teachers_count', label: 'Teachers', sortable: true },
                            { key: 'actions', label: 'Actions', align: 'right' },
                        ]}
                        renderCell={(key, row) => {
                            if (key === 'code') {
                                return <span className="font-mono text-xs text-gray-600">{row.code}</span>;
                            }
                            if (key === 'teachers_count') {
                                return <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-indigo-50 text-indigo-700">{row.teachers_count || 0}</span>;
                            }
                            if (key === 'actions') {
                                return (
                                    <div className="flex justify-end gap-1">
                                        <Link
                                            href={route('admin.subjects.edit', row.id)}
                                            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
                                        >
                                            <i className="fa-solid fa-pen text-xs"></i> Edit
                                        </Link>
                                        <button
                                            onClick={() => setDeleteTarget(row)}
                                            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <i className="fa-solid fa-trash text-xs"></i> Delete
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
                    name={deleteTarget?.name || ''}
                    href={deleteTarget ? route('admin.subjects.destroy', deleteTarget.id) : null}
                />
            </div>
        </AuthenticatedLayout>
    );
}
