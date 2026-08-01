import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Award, HandHeart, CheckCircle, Clock } from 'lucide-react';

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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight flex items-center gap-2"><HandHeart className="text-purple-600"/> Campus Mentor Board</h2>}
        >
            <Head title="Mentor Board" />

            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Open Requests */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 shadow-sm rounded-xl border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Clock className="text-orange-500" size={20}/> Open Help Requests
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">Earn badges by helping your peers with their coursework. Identities remain anonymous until you connect.</p>
                        
                        <div className="space-y-4">
                            {openRequests.length === 0 ? (
                                <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-lg">No open requests at the moment.</div>
                            ) : (
                                openRequests.map((req) => (
                                    <div key={req.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition group">
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{req.topic}</h4>
                                            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                                                Requested by <span className="bg-gray-100 px-2 py-0.5 rounded font-mono text-xs">{req.discussion?.author_name || 'AnonymousStudent'}</span>
                                            </p>
                                        </div>
                                        <div className="mt-4 sm:mt-0 flex gap-2">
                                            <button
                                                onClick={() => handleAccept(req.id)}
                                                className="px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-md hover:bg-purple-700 transition shadow-sm"
                                            >
                                                Accept Request
                                            </button>
                                            {/* For demo purposes, putting the complete button right here to show the flow fast */}
                                            <button
                                                onClick={() => handleComplete(req.id)}
                                                className="px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-md hover:bg-green-600 transition shadow-sm flex items-center gap-1"
                                                title="Demo shortcut to complete session"
                                            >
                                                <CheckCircle size={16} /> Resolve
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
                    <div className="bg-gradient-to-br from-indigo-900 to-purple-900 p-6 shadow-sm rounded-xl text-white">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Award className="text-yellow-400" size={24}/> Top Mentors
                        </h3>
                        <div className="space-y-3">
                            {topMentors.map((mentor, index) => (
                                <div key={mentor.id} className="flex justify-between items-center bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-purple-300">#{index + 1}</span>
                                        <span className="font-medium">{mentor.name}</span>
                                    </div>
                                    <div className="flex items-center gap-1 bg-yellow-400/20 text-yellow-300 px-2 py-1 rounded-full text-xs font-bold">
                                        <Award size={14}/> {mentor.mentor_badges_count}
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