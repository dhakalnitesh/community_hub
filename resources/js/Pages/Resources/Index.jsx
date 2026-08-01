import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import ResourceFormModal from '@/Pages/Resources/ResourceFormModal';
import DeleteConfirmModal from '@/Components/UI/DeleteConfirmModal';

const TYPE_META = {
    DOCUMENT: { label: 'Document', icon: 'fa-file-lines', color: 'text-blue-600 bg-blue-50' },
    PDF: { label: 'PDF', icon: 'fa-file-pdf', color: 'text-red-600 bg-red-50' },
    VIDEO: { label: 'Video', icon: 'fa-circle-play', color: 'text-emerald-600 bg-emerald-50' },
    PRESENTATION: { label: 'Presentation', icon: 'fa-file-powerpoint', color: 'text-orange-600 bg-orange-50' },
    LINK: { label: 'Link', icon: 'fa-link', color: 'text-indigo-600 bg-indigo-50' },
    OTHER: { label: 'Other', icon: 'fa-file', color: 'text-gray-600 bg-gray-50' },
};

export default function Index({ resources, subjects }) {
    const { user } = usePage().props.auth;
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const canPost = user.role === 'teacher' || user.role === 'institution_admin' || user.role === 'super_admin';

    const openCreate = () => {
        setEditing(null);
        setFormOpen(true);
    };

    const openEdit = (resource) => {
        setEditing(resource);
        setFormOpen(true);
    };

    const canManage = (resource) =>
        user.role === 'super_admin' || user.role === 'institution_admin' || user.id === resource.teacher_id;

    return (
        <AuthenticatedLayout>
            <Head title="Resources" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Resources</h1>
                        <p className="text-sm text-gray-500 mt-1">Study materials, notes, and links shared by your teachers.</p>
                    </div>
                    {canPost && (
                        <button
                            onClick={openCreate}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                        >
                            <i className="fa-solid fa-plus text-xs"></i>
                            Create Resource
                        </button>
                    )}
                </div>

                {resources.data.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <i className="fa-solid fa-folder-open text-2xl"></i>
                        </div>
                        <p className="text-gray-500">No resources yet.</p>
                        {canPost && (
                            <button onClick={openCreate} className="text-indigo-600 hover:text-indigo-800 text-sm mt-2 inline-block">
                                Upload the first resource
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {resources.data.map((resource) => {
                            const meta = TYPE_META[resource.type] || TYPE_META.OTHER;
                            return (
                                <div key={resource.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0 flex items-start gap-4">
                                            <div className={`shrink-0 w-11 h-11 rounded-lg flex items-center justify-center text-lg ${meta.color}`}>
                                                <i className={`fa-solid ${meta.icon}`}></i>
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-600">
                                                        <i className="fa-solid fa-book-open text-xs"></i>
                                                        {resource.subject?.name || 'General'}
                                                    </span>
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${meta.color}`}>
                                                        {meta.label}
                                                    </span>
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900 truncate">{resource.title}</h3>
                                                {resource.description && (
                                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{resource.description}</p>
                                                )}
                                                <div className="flex items-center gap-4 mt-2">
                                                    {resource.file_url && (
                                                        <a
                                                            href={resource.file_url}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800"
                                                        >
                                                            <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
                                                            View Attachment
                                                        </a>
                                                    )}
                                                    <span className="text-xs text-gray-400">
                                                        by {resource.teacher?.name}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        {canManage(resource) && (
                                            <div className="flex shrink-0 gap-1">
                                                <button
                                                    onClick={() => openEdit(resource)}
                                                    className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
                                                >
                                                    <i className="fa-solid fa-pen text-xs"></i> Edit
                                                </button>
                                                <button
                                                    onClick={() => setDeleteTarget(resource)}
                                                    className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                                                >
                                                    <i className="fa-solid fa-trash text-xs"></i> Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {formOpen && (
                <ResourceFormModal
                    open={formOpen}
                    onClose={() => setFormOpen(false)}
                    subjects={subjects}
                    resource={editing}
                />
            )}

            <DeleteConfirmModal
                show={deleteTarget !== null}
                onClose={() => setDeleteTarget(null)}
                name={deleteTarget?.title || ''}
                href={deleteTarget ? route('resources.destroy', deleteTarget.id) : null}
            />
        </AuthenticatedLayout>
    );
}
