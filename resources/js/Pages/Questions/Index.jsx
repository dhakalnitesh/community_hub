import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import QuestionCard from '@/Components/QuestionCard';
import QuestionFormModal from '@/Pages/Questions/QuestionFormModal';
import TrackQuestionModal from '@/Pages/Questions/TrackQuestionModal';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ discussions, filters, subjects }) {
    const { flash } = usePage().props;
    const [askOpen, setAskOpen] = useState(false);
    const [trackOpen, setTrackOpen] = useState(false);

    return (
        <AuthenticatedLayout>
            <Head title="Anonymous Q&A" />

            {/* Mobile Ask Button (Floating) */}
            <div className="fixed bottom-4 right-4 z-40 md:hidden">
                <button
                    onClick={() => setAskOpen(true)}
                    className="w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-all hover:scale-110 active:scale-95"
                    title="Ask a Question"
                >
                    <i className="fa-solid fa-pen-to-square text-lg" />
                </button>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Anonymous Q&A</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Explore doubts, share knowledge, and help students learn without the fear of judgement.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setTrackOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            <i className="fa-solid fa-magnifying-glass text-xs text-gray-400"></i>
                            Track Question
                        </button>
                        <button
                            onClick={() => setAskOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                        >
                            <i className="fa-solid fa-pen-to-square text-xs"></i>
                            Ask a Question
                        </button>
                    </div>
                </div>

                {flash?.tracking_token && (
                    <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-5 shadow-sm flex items-start gap-4 mb-6">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <i className="fa-solid fa-circle-check text-green-600"></i>
                        </div>
                        <div>
                            <h3 className="font-bold text-base">Your question has been posted successfully!</h3>
                            <p className="text-sm mt-1">If you posted anonymously, save this tracking token to check the status later:</p>
                            <div className="mt-3 flex items-center gap-3">
                                <span className="bg-white px-4 py-2 rounded-lg border border-green-200 font-mono font-bold tracking-widest text-lg shadow-inner">
                                    {flash.tracking_token}
                                </span>
                                <button
                                    onClick={() => navigator.clipboard.writeText(flash.tracking_token)}
                                    className="text-sm font-medium text-green-700 hover:text-green-900 bg-green-100/50 hover:bg-green-200 px-3 py-1.5 rounded-lg transition-colors"
                                >
                                    Copy Token
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex gap-2 pb-6 overflow-x-auto">
                    <Link href={route('questions.index')} className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors border ${!filters.status ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}>
                        All Questions
                    </Link>
                    <Link href={route('questions.index', { status: 'open' })} className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors border ${filters.status === 'open' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}>
                        Unanswered
                    </Link>
                    <Link href={route('questions.index', { status: 'resolved' })} className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors border ${filters.status === 'resolved' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}>
                        Resolved
                    </Link>
                </div>

                {discussions.data.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                            <i className="fa-solid fa-comments text-3xl text-gray-400"></i>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">No questions found</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            It looks quiet here. Be the first to start a meaningful discussion.
                        </p>
                        <button
                            onClick={() => setAskOpen(true)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                        >
                            <i className="fa-solid fa-plus text-sm"></i>
                            Start a Discussion
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4">
                            {discussions.data.map((discussion) => (
                                <QuestionCard key={discussion.id} discussion={discussion} />
                            ))}
                        </div>

                        {discussions.links && discussions.links.length > 3 && (
                            <div className="mt-8 flex items-center justify-center gap-2">
                                {discussions.links.map((link, i) => {
                                    if (!link.url) {
                                        return (
                                            <span key={i} className="px-4 py-2 text-sm text-gray-400 font-medium rounded-lg border border-transparent" dangerouslySetInnerHTML={{ __html: link.label }} />
                                        );
                                    }
                                    return (
                                        <Link
                                            key={i}
                                            href={link.url}
                                            preserveScroll
                                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors border ${link.active
                                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>

            {askOpen && (
                <QuestionFormModal
                    open={askOpen}
                    onClose={() => setAskOpen(false)}
                    subjects={subjects}
                />
            )}

            <TrackQuestionModal
                open={trackOpen}
                onClose={() => setTrackOpen(false)}
            />
        </AuthenticatedLayout>
    );
}
