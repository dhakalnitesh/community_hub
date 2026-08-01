import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AnnouncementFormModal from '@/Pages/Announcements/AnnouncementFormModal';
import DeleteConfirmModal from '@/Components/UI/DeleteConfirmModal';

export default function Index({ announcements, subjects }) {
    const { user } = usePage().props.auth;
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const canPost = user.role === 'teacher' || user.role === 'institution_admin' || user.role === 'super_admin';

    const openCreate = () => {
        setEditing(null);
        setFormOpen(true);
    };

    const openEdit = (announcement) => {
        setEditing(announcement);
        setFormOpen(true);
    };

    const canManage = (announcement) =>
        user.role === 'super_admin' || user.role === 'institution_admin' || user.id === announcement.user_id;

    return (
        <AuthenticatedLayout>
            <Head title="Announcements" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
                        <p className="text-sm text-gray-500 mt-1">Stay updated with the latest class-wide notices.</p>
                    </div>
                    {canPost && (
                        <button
                            onClick={openCreate}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                        >
                            <i className="fa-solid fa-bullhorn text-xs"></i>
                            Post Announcement
                        </button>
                    )}
                </div>

                {announcements.data.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <i className="fa-solid fa-bullhorn text-2xl"></i>
                        </div>
                        <p className="text-gray-500">No announcements yet.</p>
                        {canPost && (
                            <button onClick={openCreate} className="text-indigo-600 hover:text-indigo-800 text-sm mt-2 inline-block">
                                Post the first announcement
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {announcements.data.map((announcement) => (
                            <div key={announcement.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-700">
                                                <i className="fa-solid fa-book-open text-xs"></i>
                                                {announcement.subject?.name || 'General'}
                                            </span>
                                            <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
                                                <i className="fa-solid fa-clock text-xs"></i>
                                                {new Date(announcement.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900">{announcement.title}</h3>
                                        <div className="text-sm text-gray-600 mt-2 whitespace-pre-wrap">{announcement.content}</div>
                                        <p className="text-xs text-gray-400 mt-3">
                                            Posted by <span className="font-medium text-gray-600">{announcement.user?.name}</span>
                                        </p>
                                    </div>
                                    {canManage(announcement) && (
                                        <div className="flex shrink-0 gap-1">
                                            <button
                                                onClick={() => openEdit(announcement)}
                                                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
                                            >
                                                <i className="fa-solid fa-pen text-xs"></i> Edit
                                            </button>
                                            <button
                                                onClick={() => setDeleteTarget(announcement)}
                                                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <i className="fa-solid fa-trash text-xs"></i> Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {formOpen && (
                <AnnouncementFormModal
                    open={formOpen}
                    onClose={() => setFormOpen(false)}
                    subjects={subjects}
                    announcement={editing}
                />
            )}

            <DeleteConfirmModal
                show={deleteTarget !== null}
                onClose={() => setDeleteTarget(null)}
                name={deleteTarget?.title || ''}
                href={deleteTarget ? route('announcements.destroy', deleteTarget.id) : null}
            />
        </AuthenticatedLayout>
    );
}
