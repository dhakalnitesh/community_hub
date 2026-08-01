import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function MyClasses({ auth, subjects }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">My Classes</h2>}
        >
            <Head title="My Classes" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Teaching Hub</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            View and manage the classes and subjects assigned to you for the current academic session.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl border border-gray-200">
                        <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                            <i className="fa-solid fa-book-open"></i>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Subjects</p>
                            <p className="text-xl font-bold text-gray-900 leading-none mt-1">{subjects.length}</p>
                        </div>
                    </div>
                </div>

                {subjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {subjects.map((subject) => (
                            <div
                                key={subject.id}
                                className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-300 flex flex-col h-full"
                            >
                                <div className="flex justify-between items-start mb-5">
                                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center text-lg">
                                        <i className="fa-solid fa-book"></i>
                                    </div>
                                    <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase">
                                        {subject.code}
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight group-hover:text-indigo-600 transition-colors">
                                    {subject.name}
                                </h3>

                                <div className="space-y-2 text-sm text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <i className="fa-solid fa-layer-group text-xs text-gray-400"></i>
                                        <p>{subject.semester?.name}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <i className="fa-solid fa-building-columns text-xs text-gray-400"></i>
                                        <p>{subject.semester?.institution?.name}</p>
                                    </div>
                                </div>

                                <div className="mt-auto pt-5">
                                    <div className="grid grid-cols-2 gap-3 border-t border-gray-100 pt-4">
                                        <Link
                                            href={route('assignments.index', { subject_id: subject.id })}
                                            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            <i className="fa-solid fa-clipboard-list text-xs"></i>
                                            Assignments
                                        </Link>
                                        <Link
                                            href={route('questions.index', { subject_id: subject.id })}
                                            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            <i className="fa-solid fa-comments text-xs"></i>
                                            Q&A
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl p-16 text-center border border-gray-200 max-w-2xl mx-auto mt-10">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                            <i className="fa-solid fa-circle-xmark text-3xl"></i>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">No Classes Assigned</h3>
                        <p className="text-sm text-gray-500">You currently do not have any subjects assigned to you for this academic session. Please contact the institution administrator.</p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
