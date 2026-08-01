import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';

export default function SubmissionView({ submission }) {
    const { auth } = usePage().props;
    const [score, setScore] = useState(submission.score || '');
    const [feedback, setFeedback] = useState(submission.feedback || '');

    const canGrade = auth.user.role === 'teacher' || auth.user.role === 'super_admin' || auth.user.role === 'institution_admin';
    const isOwner = auth.user.id === submission.student_id;

    const handleGrade = (e) => {
        e.preventDefault();
        router.put(route('assignments.submissions.update', submission.id), {
            score,
            feedback,
        });
    };

    const inputClass =
        'w-full rounded-lg border-slate-300 px-3 py-1.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500';

    return (
        <AuthenticatedLayout>
            <Head title="Submission" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
                <div className="mb-6">
                    <Link href={route('assignments.show', submission.assignment_id)} className="text-sm font-medium text-gray-600 hover:text-indigo-600 flex items-center gap-2 transition-colors">
                        <i className="fa-solid fa-arrow-left text-xs"></i>
                        Back to Assignment
                    </Link>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <i className="fa-solid fa-user text-indigo-500"></i>
                            Submission by {submission.student?.name}
                        </h1>
                        <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                                submission.status === 'graded'
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'bg-yellow-50 text-yellow-700'
                            }`}>
                                {submission.status}
                            </span>
                            {submission.is_late && (
                                <span className="inline-flex items-center rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-600">
                                    <i className="fa-solid fa-clock text-[10px] mr-1"></i> Late
                                </span>
                            )}
                        </div>
                    </div>

                    <p className="text-gray-600 whitespace-pre-wrap mb-4">{submission.content}</p>

                    {submission.file_url && (
                        <div className="mb-4">
                            <a
                                href={submission.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 text-sm"
                            >
                                <i className="fa-solid fa-paperclip text-xs"></i>
                                Attached file: {submission.file_url}
                            </a>
                        </div>
                    )}

                    <div className="text-sm text-gray-500 mb-4 flex items-center gap-1.5">
                        <i className="fa-solid fa-clock text-xs"></i>
                        Submitted: {new Date(submission.submitted_at).toLocaleString()}
                    </div>

                    {submission.status === 'graded' && (
                        <div className="mt-4 p-4 bg-emerald-50/50 border border-emerald-100 rounded-lg">
                            <p className="font-medium text-gray-900">
                                Score: <span className="text-lg text-emerald-700">{submission.score}/{submission.assignment?.max_score || 'N/A'}</span>
                            </p>
                            {submission.feedback && (
                                <p className="mt-2 text-gray-700">
                                    <span className="font-medium">Feedback:</span> {submission.feedback}
                                </p>
                            )}
                        </div>
                    )}

                    {canGrade && (
                        <form onSubmit={handleGrade} className="mt-6 border-t pt-6">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">Grade Submission</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <InputLabel htmlFor="score" value={`Score (max: ${submission.assignment?.max_score || 'N/A'})`} />
                                    <input
                                        id="score"
                                        type="number"
                                        value={score}
                                        onChange={(e) => setScore(e.target.value)}
                                        className={inputClass}
                                        min="0"
                                        max={submission.assignment?.max_score || 999999}
                                        required
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <InputLabel htmlFor="feedback" value="Feedback" />
                                    <textarea
                                        id="feedback"
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        className={inputClass}
                                        rows={2}
                                    />
                                </div>
                            </div>
                            <div className="mt-3 flex justify-end">
                                <PrimaryButton type="submit">
                                    <i className="fa-solid fa-check mr-2 text-xs"></i>
                                    {submission.status === 'graded' ? 'Update Grade' : 'Submit Grade'}
                                </PrimaryButton>
                            </div>
                        </form>
                    )}

                    {isOwner && submission.status === 'submitted' && (
                        <div className="mt-6 text-center text-sm text-gray-500">
                            Waiting for teacher to grade your submission.
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
