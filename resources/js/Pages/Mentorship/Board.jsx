import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

export default function Board({ auth, openRequests, topMentors }) {

    const handleAccept = (sessionId) => {
        router.post(route('mentorship.accept', sessionId));
    };

    const handleComplete = (sessionId) => {
        router.post(route('mentorship.complete', sessionId), {
            notes: "Quick 15-min session over Discord. Issue resolved."
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header="Campus Mentor Board"
        >
            <Head title="Mentor Board" />

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Open Requests */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 shadow-sm rounded-xl border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <i className="fa-regular fa-clock text-orange-500"></i> Open Help Requests
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">Earn badges by helping your peers with their coursework. Identities remain anonymous until you connect.</p>

                        <div className="space-y-4">
                            {openRequests.length === 0 ? (
                                <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-lg">No open requests at the moment.</div>
                            ) : (
                                openRequests.map((req) => (
                                    <div key={req.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition group">
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{req.topic}</h4>
                                            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                                                Requested by <span className="bg-gray-100 px-2 py-0.5 rounded font-mono text-xs">{req.discussion?.author_name || 'AnonymousStudent'}</span>
                                            </p>
                                        </div>
                                        <div className="mt-4 sm:mt-0 flex gap-2">
                                            <button
                                                onClick={() => handleAccept(req.id)}
                                                className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-md hover:bg-indigo-700 transition shadow-sm"
                                            >
                                                Accept Request
                                            </button>
                                            {/* For demo purposes, putting the complete button right here to show the flow fast */}
                                            <button
                                                onClick={() => handleComplete(req.id)}
                                                className="px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-md hover:bg-green-600 transition shadow-sm flex items-center gap-1"
                                                title="Demo shortcut to complete session"
                                            >
                                                <i className="fa-solid fa-check-circle"></i> Resolve
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Leaderboard */}
                <div className="space-y-6">
                    <div className="bg-white p-6 shadow-sm rounded-xl border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <i className="fa-solid fa-award text-yellow-500"></i> Top Mentors
                        </h3>
                        <div className="space-y-3">
                            {topMentors.map((mentor, index) => (
                                <div key={mentor.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-indigo-600">#{index + 1}</span>
                                        <span className="font-medium text-gray-700">{mentor.name}</span>
                                    </div>
                                    <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-bold">
                                        <i className="fa-solid fa-award"></i> {mentor.mentor_badges_count}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
