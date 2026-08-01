import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function MySubject({ subjects }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    My Subjects
                </h2>
            }
        >
            <Head title="My Subjects" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                {subjects.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                        <p className="text-gray-500 text-lg">You are not enrolled in any subjects yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {subjects.map((subject) => (
                            <div
                                key={subject.id}
                                className="bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all"
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold text-gray-900 truncate" title={subject.name}>
                                            {subject.name}
                                        </h3>
                                        <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                                            {subject.code}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                        {subject.description || 'No description provided.'}
                                    </p>

                                    <div className="space-y-2 text-sm text-gray-500 mb-6">
                                        <div className="flex items-center gap-2">
                                            <i className="fa-solid fa-calendar text-xs text-gray-400"></i>
                                            <span>{subject.semester?.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <i className="fa-solid fa-building-columns text-xs text-gray-400"></i>
                                            <span>{subject.semester?.institution?.name}</span>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700">
                                            {subject.teachers?.length || 0} Teacher(s)
                                        </span>
                                        <Link
                                            href={route('assignments.index', { subject_id: subject.id })}
                                            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                                        >
                                            View Assignments &rarr;
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
