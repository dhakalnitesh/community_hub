import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Index({ assignments }) {
    const { auth } = usePage().props;
    const isStudent = auth.user.role === 'student';

    return (
        <AuthenticatedLayout>
            <Head title="Assignments" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
                        <p className="text-sm text-gray-500 mt-1">Track, submit, and grade assignments for your subjects.</p>
                    </div>
                    {!isStudent && (
                        <Link
                            href={route('assignments.create')}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                        >
                            <i className="fa-solid fa-plus text-xs"></i>
                            Create Assignment
                        </Link>
                    )}
                </div>

                {assignments.data.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <i className="fa-solid fa-clipboard-list text-2xl"></i>
                        </div>
                        <p className="text-gray-500">No assignments yet.</p>
                        {!isStudent && (
                            <Link
                                href={route('assignments.create')}
                                className="text-indigo-600 hover:text-indigo-800 text-sm mt-2 inline-block"
                            >
                                Create the first assignment
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {assignments.data.map((assignment) => {
                            const pastDue = assignment.due_date && new Date(assignment.due_date) < new Date();
                            return (
                                <Link
                                    key={assignment.id}
                                    href={route('assignments.show', assignment.id)}
                                    className="block bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:border-indigo-300 hover:shadow-md transition-all"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-4 min-w-0">
                                            <div className="shrink-0 w-11 h-11 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                                <i className="fa-solid fa-file-lines"></i>
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="text-lg font-bold text-gray-900 truncate">{assignment.title}</h3>
                                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{assignment.description}</p>
                                                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-500">
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <i className="fa-solid fa-book-open text-gray-400"></i>
                                                        {assignment.subject?.name}
                                                    </span>
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <i className={`fa-solid fa-clock ${pastDue ? 'text-red-500' : 'text-gray-400'}`}></i>
                                                        Due: {new Date(assignment.due_date).toLocaleDateString()}
                                                    </span>
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <i className="fa-solid fa-user text-gray-400"></i>
                                                        {assignment.teacher?.name}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0 flex flex-col items-end gap-2">
                                            {assignment.max_score && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-1 text-xs font-semibold">
                                                    <i className="fa-solid fa-star text-[10px]"></i>
                                                    {assignment.max_score} pts
                                                </span>
                                            )}
                                            <span className={`text-[11px] font-medium ${assignment.allow_late_submission ? 'text-amber-600' : 'text-gray-400'}`}>
                                                {assignment.allow_late_submission ? 'Late OK' : 'No late'}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {assignments.total > assignments.per_page && (
                    <div className="mt-6 flex justify-center gap-2">
                        {assignments.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                                    link.active
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
