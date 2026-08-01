import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import AnswerCard from '@/Components/AnswerCard';
import VoteButtons from '@/Components/VoteButtons';
import QuestionFormModal from '@/Pages/Questions/QuestionFormModal';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import DeleteConfirmModal from '@/Components/UI/DeleteConfirmModal';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Show({ discussion, permissions }) {
    const { auth } = usePage().props;
    const [showAnswerForm, setShowAnswerForm] = useState(false);
    const [answerBody, setAnswerBody] = useState('');
    const [answerAnonymous, setAnswerAnonymous] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const isOwner = auth.user.id === discussion.user_id;
    const canDelete = permissions?.delete || false;

    const handleRequestMentor = () => {
        if (confirm('Would you like to request a senior student to mentor you on this topic?')) {
            router.post(route('mentorship.store'), {
                discussion_id: discussion.id,
                topic: discussion.title,
            });
        }
    };

    const handleSubmitAnswer = (e) => {
        e.preventDefault();
        router.post(route('questions.answers.store', discussion.id), {
            body: answerBody,
            is_anonymous: answerAnonymous,
        }, {
            onSuccess: () => {
                setAnswerBody('');
                setShowAnswerForm(false);
            },
        });
    };

    const statusConfig = {
        open: { color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'fa-lock-open' },
        answered: { color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', icon: 'fa-circle-check' },
        closed: { color: 'text-gray-600', bg: 'bg-gray-100', border: 'border-gray-200', icon: 'fa-lock' },
    };

    const currentStatus = statusConfig[discussion.status] || statusConfig.open;

    return (
        <AuthenticatedLayout>
            <Head title={discussion.title} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Link href={route('questions.index')} className="text-sm font-medium text-gray-600 hover:text-indigo-600 flex items-center gap-2 transition-colors">
                        <i className="fa-solid fa-arrow-left text-xs"></i>
                        Back to Discussions
                    </Link>
                    <div className="flex items-center gap-2">
                        {isOwner && (
                            <>
                                <button
                                    onClick={handleRequestMentor}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors"
                                >
                                    <i className="fa-solid fa-handshake-angle"></i>
                                    Request Mentor
                                </button>
                                <button
                                    onClick={() => setEditOpen(true)}
                                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                                >
                                    <i className="fa-solid fa-pen"></i>
                                    Edit
                                </button>
                            </>
                        )}
                        {canDelete && (
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

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row gap-8">
                        <div className="shrink-0 flex sm:flex-col items-center sm:items-start gap-4">
                            <VoteButtons
                                votableType="discussion"
                                votableId={discussion.id}
                                upvotes={discussion.upvotes_count}
                                downvotes={discussion.downvotes_count}
                            />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg flex items-center gap-1.5 border ${currentStatus.bg} ${currentStatus.color} ${currentStatus.border}`}>
                                    <i className={`fa-solid ${currentStatus.icon} text-xs`}></i>
                                    {discussion.status}
                                </span>
                                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider bg-gray-100 px-3 py-1.5 rounded-lg">
                                    {discussion.discussionable_type === 'subject'
                                        ? discussion.discussionable?.name
                                        : discussion.discussionable_type}
                                </span>
                            </div>

                            <h1 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">{discussion.title}</h1>

                            <div className="text-gray-600 font-normal leading-relaxed mb-8 whitespace-pre-wrap">
                                {discussion.body}
                            </div>

                            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 border-t border-gray-100 pt-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-[11px] font-bold">
                                        {discussion.author_name?.charAt(0) || 'U'}
                                    </div>
                                    <span className="text-gray-900 font-semibold">{discussion.author_name}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-gray-400">
                                    <i className="fa-solid fa-clock text-xs"></i>
                                    <span>{new Date(discussion.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-2">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        {discussion.answers_count} {discussion.answers_count === 1 ? 'Answer' : 'Answers'}
                    </h3>

                    <div className="space-y-6">
                        {discussion.answers.map((answer) => (
                            <AnswerCard
                                key={answer.id}
                                answer={answer}
                                discussionUserId={discussion.user_id}
                                canAccept={permissions?.update}
                            />
                        ))}
                    </div>

                    {discussion.status !== 'closed' && (
                        <div className="mt-12">
                            {showAnswerForm ? (
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8">
                                    <h4 className="text-lg font-bold text-gray-900 mb-4">Your Answer</h4>
                                    <form onSubmit={handleSubmitAnswer} className="space-y-4">
                                        <textarea
                                            value={answerBody}
                                            onChange={(e) => setAnswerBody(e.target.value)}
                                            className="w-full rounded-lg border-slate-300 px-3 py-1.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 resize-y"
                                            rows={6}
                                            placeholder="Write your answer here in detail..."
                                            required
                                        />

                                        <div className="flex flex-col sm:flex-row items-center justify-between pt-4 gap-4">
                                            <div className="flex items-center gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setAnswerAnonymous(!answerAnonymous)}
                                                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${answerAnonymous ? 'bg-indigo-600' : 'bg-gray-300'}`}
                                                    role="switch"
                                                    aria-checked={answerAnonymous}
                                                >
                                                    <span
                                                        aria-hidden="true"
                                                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${answerAnonymous ? 'translate-x-5' : 'translate-x-0'}`}
                                                    />
                                                </button>
                                                <span className="text-sm font-semibold text-gray-700">Post Anonymously</span>
                                            </div>

                                            <div className="flex gap-3 w-full sm:w-auto">
                                                <SecondaryButton
                                                    type="button"
                                                    onClick={() => setShowAnswerForm(false)}
                                                    className="flex-1 justify-center"
                                                >
                                                    Cancel
                                                </SecondaryButton>
                                                <PrimaryButton type="submit" className="flex-1 justify-center">
                                                    <i className="fa-solid fa-paper-plane mr-2"></i>
                                                    Post Answer
                                                </PrimaryButton>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowAnswerForm(true)}
                                    className="w-full py-6 rounded-xl bg-indigo-50 hover:bg-indigo-100 border-2 border-dashed border-indigo-200 hover:border-indigo-400 text-indigo-600 font-semibold transition-all flex items-center justify-center gap-3"
                                >
                                    <i className="fa-solid fa-pen-to-square"></i>
                                    Write an Answer
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {editOpen && (
                <QuestionFormModal
                    open={editOpen}
                    onClose={() => setEditOpen(false)}
                    discussion={discussion}
                />
            )}

            <DeleteConfirmModal
                show={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                name={discussion.title}
                href={route('questions.destroy', discussion.id)}
            />
        </AuthenticatedLayout>
    );
}
