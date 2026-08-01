import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage, useForm } from '@inertiajs/react';
import { useState } from 'react';
import DeleteConfirmModal from '@/Components/UI/DeleteConfirmModal';

export default function Show({ assignment, submission }) {
    const { auth } = usePage().props;
    const [showSubmitForm, setShowSubmitForm] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        content: '',
        files: [],
    });

    const isTeacherOwner = auth.user.role === 'teacher' && assignment.teacher_id === auth.user.id;
    const canEdit = isTeacherOwner || auth.user.role === 'super_admin' || auth.user.role === 'institution_admin';

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('assignments.submissions.store', assignment.id), {
            onSuccess: () => {
                reset();
                setShowSubmitForm(false);
            },
        });
    };

    const isPastDue = assignment.due_date && new Date(assignment.due_date) < new Date();
    const canSubmit = auth.user.role === 'student' && !submission && (!isPastDue || assignment.allow_late_submission);

    const inputClass =
        'w-full rounded-lg border-slate-300 px-3 py-1.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500';

    return (
        <AuthenticatedLayout>
            <Head title={assignment.title} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Link href={route('assignments.index')} className="text-sm font-medium text-gray-600 hover:text-indigo-600 flex items-center gap-2 transition-colors">
                        <i className="fa-solid fa-arrow-left text-xs"></i>
                        Back to Assignments
                    </Link>
                    <div className="flex items-center gap-2">
                        {canEdit && (
                            <Link
                                href={route('assignments.edit', assignment.id)}
                                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors"
                            >
                                <i className="fa-solid fa-pen"></i>
                                Edit
                            </Link>
                        )}
                        {canEdit && (
                            <button
                                onClick={() => setDeleteOpen(true)}
                                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <i className="fa-solid fa-trash"></i>
                                Delete
                            </button>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-700">
                            <i className="fa-solid fa-book-open text-xs"></i>
                            {assignment.subject?.name}
                        </span>
                        {assignment.max_score && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                                <i className="fa-solid fa-star text-xs"></i>
                                {assignment.max_score} points
                            </span>
                        )}
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-3">{assignment.title}</h1>
                    <p className="text-gray-600 whitespace-pre-wrap mb-4">{assignment.description}</p>

                    <div className="border-t pt-4 mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <i className={`fa-solid fa-clock ${isPastDue ? 'text-red-500' : 'text-gray-400'}`}></i>
                            <span className="font-medium">Due:</span>{' '}
                            <span className={isPastDue ? 'text-red-600 font-medium' : ''}>
                                {new Date(assignment.due_date).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <i className="fa-solid fa-user text-gray-400"></i>
                            <span className="font-medium">Teacher:</span> {assignment.teacher?.name}
                        </div>
                        <div className="flex items-center gap-2">
                            <i className={`fa-solid ${assignment.allow_late_submission ? 'fa-door-open text-amber-500' : 'fa-door-closed text-gray-400'}`}></i>
                            <span className="font-medium">Late Submission:</span>{' '}
                            {assignment.allow_late_submission ? 'Allowed' : 'Not allowed'}
                        </div>
                        <div className="flex items-center gap-2">
                            <i className="fa-solid fa-building-columns text-gray-400"></i>
                            <span className="font-medium">Subject:</span> {assignment.subject?.name}
                        </div>
                    </div>
                </div>

                {auth.user.role === 'student' && (
                    <div>
                        {submission ? (
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <i className="fa-solid fa-paper-plane text-indigo-500"></i>
                                    Your Submission
                                </h3>
                                <p className="text-gray-600 whitespace-pre-wrap mb-2">{submission.content}</p>
                                {submission.file_urls && submission.file_urls.length > 0 && (
                                    <div className="mt-2">
                                        <p className="text-sm font-medium text-gray-700 mb-1">Attached Files:</p>
                                        <ul className="space-y-1">
                                            {submission.file_urls.map((url, index) => (
                                                <li key={index}>
                                                    <a href={url} target="_blank" rel="noreferrer" className="text-sm text-indigo-600 hover:underline inline-flex items-center gap-1.5">
                                                        <i className="fa-solid fa-paperclip text-xs"></i>
                                                        Attachment {index + 1}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                    <span className="inline-flex items-center gap-1.5">
                                        Status:
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${submission.status === 'graded' ? 'bg-emerald-50 text-emerald-700' : 'bg-yellow-50 text-yellow-700'}`}>
                                            {submission.status}
                                        </span>
                                    </span>
                                    {submission.is_late && (
                                        <span className="inline-flex items-center rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-600">
                                            <i className="fa-solid fa-clock text-[10px] mr-1"></i> Late
                                        </span>
                                    )}
                                    <span>Submitted: {new Date(submission.submitted_at).toLocaleString()}</span>
                                </div>
                                {submission.status === 'graded' && (
                                    <div className="mt-4 p-4 bg-emerald-50/50 border border-emerald-100 rounded-lg">
                                        <p className="font-medium text-gray-900">
                                            Score: <span className="text-lg text-emerald-700">{submission.score}/{assignment.max_score}</span>
                                        </p>
                                        {submission.feedback && (
                                            <p className="mt-2 text-gray-700"><span className="font-medium">Feedback:</span> {submission.feedback}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : canSubmit ? (
                            <div>
                                {showSubmitForm ? (
                                    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Submit Your Work</h4>
                                        <textarea
                                            value={data.content}
                                            onChange={(e) => setData('content', e.target.value)}
                                            className={inputClass}
                                            rows={5}
                                            placeholder="Write your answer..."
                                        />
                                        {errors.content && <p className="text-sm text-red-600 mt-1">{errors.content}</p>}
                                        <div className="mt-3">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Files (optional)</label>
                                            <input
                                                type="file"
                                                multiple
                                                onChange={(e) => setData('files', Array.from(e.target.files))}
                                                className={inputClass}
                                            />
                                            {errors.files && <p className="text-sm text-red-600 mt-1">{errors.files}</p>}
                                        </div>
                                        <div className="mt-3 flex gap-2 justify-end">
                                            <button
                                                type="button"
                                                onClick={() => setShowSubmitForm(false)}
                                                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                                            >
                                                <i className="fa-solid fa-paper-plane mr-2 text-xs"></i>
                                                Submit
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <button
                                        onClick={() => setShowSubmitForm(true)}
                                        className="w-full py-3 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-xl border border-dashed border-indigo-300 hover:bg-indigo-100 transition-colors inline-flex items-center justify-center gap-2"
                                    >
                                        <i className="fa-solid fa-paper-plane"></i>
                                        {isPastDue ? 'Submit Late' : 'Submit Your Work'}
                                    </button>
                                )}
                            </div>
                        ) : isPastDue && !assignment.allow_late_submission ? (
                            <div className="bg-red-50 rounded-xl border border-red-200 p-4 text-sm text-red-700 flex items-center gap-2">
                                <i className="fa-solid fa-circle-exclamation"></i>
                                Late submissions are not allowed for this assignment.
                            </div>
                        ) : null}
                    </div>
                )}

                {canEdit && (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Submissions</h3>
                        <p className="text-sm text-gray-500">Submissions management will be available here.</p>
                    </div>
                )}
            </div>

            <DeleteConfirmModal
                show={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                name={assignment.title}
                href={route('assignments.destroy', assignment.id)}
            />
        </AuthenticatedLayout>
    );
}
