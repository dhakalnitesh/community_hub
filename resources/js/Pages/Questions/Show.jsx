import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import AnswerCard from '@/Components/AnswerCard';
import VoteButtons from '@/Components/VoteButtons';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Show({ discussion, permissions }) {
    const { auth } = usePage().props;
    const [showAnswerForm, setShowAnswerForm] = useState(false);
    const [answerBody, setAnswerBody] = useState('');
    const [answerAnonymous, setAnswerAnonymous] = useState(false);

    const isOwner = auth.user.id === discussion.user_id;
    const canDelete = permissions?.delete || false;

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this question?')) {
            router.delete(route('questions.destroy', discussion.id));
        }
    };

    const handleRequestMentor = () => {
        if (confirm('Would you like to request a senior student to mentor you on this topic?')) {
            router.post(route('mentorship.store'), {
                discussion_id: discussion.id,
                topic: discussion.title
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
            }
        });
    };

    const statusConfig = {
        open: { color: 'text-green-700', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: 'lock_open' },
        answered: { color: 'text-blue-700', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: 'check_circle' },
        closed: { color: 'text-gray-700', bg: 'bg-gray-500/10', border: 'border-gray-500/20', icon: 'lock' },
    };

    const currentStatus = statusConfig[discussion.status] || statusConfig.open;

    return (
        <AuthenticatedLayout header="Discussion Thread">
            <Head title={discussion.title} />

            <div className="max-w-4xl mx-auto space-y-8 pb-12 mt-4">
                
                {/* Header Nav */}
                <div className="flex items-center justify-between bg-white/80 backdrop-blur-md px-6 py-4 rounded-3xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <Link href={route('questions.index')} className="text-on-surface-variant hover:text-primary font-bold flex items-center gap-2 transition-colors">
                        <span className="material-symbols-outlined text-[20px]">arrow_back</span> Back to Discussions
                    </Link>
                    <div className="flex items-center gap-4">
                        {isOwner && (
                            <>
                                <button onClick={handleRequestMentor} className="text-primary hover:text-primary/80 font-bold flex items-center gap-1 transition-colors text-sm px-3 py-1 bg-primary/10 rounded-full">
                                    <span className="material-symbols-outlined text-[18px]">handshake</span> Request Mentor
                                </button>
                                <Link href={route('questions.edit', discussion.id)} className="text-on-surface-variant hover:text-primary font-bold flex items-center gap-1 transition-colors text-sm">
                                    <span className="material-symbols-outlined text-[18px]">edit</span> Edit
                                </Link>
                            </>
                        )}
                        {canDelete && (
                            <button onClick={handleDelete} className="text-error/80 hover:text-error font-bold flex items-center gap-1 transition-colors text-sm">
                                <span className="material-symbols-outlined text-[18px]">delete</span> Delete
                            </button>
                        )}
                    </div>
                </div>

                {/* Main Question Card */}
                <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-8">
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
                                <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${currentStatus.bg} ${currentStatus.color} ${currentStatus.border} border`}>
                                    <span className="material-symbols-outlined text-[14px]">{currentStatus.icon}</span>
                                    {discussion.status}
                                </span>
                                <span className="text-[11px] font-bold text-outline uppercase tracking-wider bg-surface-container px-3 py-1.5 rounded-lg">
                                    {discussion.discussionable_type === 'subject'
                                        ? discussion.discussionable?.name
                                        : discussion.discussionable_type}
                                </span>
                            </div>

                            <h1 className="text-3xl font-extrabold text-on-surface mb-6 leading-tight">{discussion.title}</h1>
                            
                            <div className="prose prose-on-surface max-w-none text-on-surface-variant font-medium leading-relaxed mb-8 whitespace-pre-wrap">
                                {discussion.body}
                            </div>

                            <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-on-surface-variant border-t border-surface-container-low pt-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[11px] font-bold">
                                        {discussion.author_name?.charAt(0) || 'U'}
                                    </div>
                                    <span className="text-on-surface font-bold">{discussion.author_name}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-outline">
                                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                                    <span>{new Date(discussion.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Answers Section */}
                <div className="pt-4">
                    <h3 className="text-2xl font-bold text-on-surface mb-6 flex items-center gap-2">
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

                    {/* Answer Form */}
                    {discussion.status !== 'closed' && (
                        <div className="mt-12">
                            {showAnswerForm ? (
                                <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-8">
                                    <h4 className="text-lg font-bold text-on-surface mb-4">Your Answer</h4>
                                    <form onSubmit={handleSubmitAnswer} className="space-y-4">
                                        <textarea
                                            value={answerBody}
                                            onChange={(e) => setAnswerBody(e.target.value)}
                                            className="w-full bg-surface-container-lowest border border-surface-container-low text-on-surface rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium placeholder:text-outline resize-y"
                                            rows={6}
                                            placeholder="Write your answer here in detail..."
                                            required
                                        />
                                        
                                        <div className="flex flex-col sm:flex-row items-center justify-between pt-4 gap-4">
                                            <label className="flex items-center gap-4 cursor-pointer group">
                                                <div
                                                    onClick={() => setAnswerAnonymous(!answerAnonymous)}
                                                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 ease-in-out ${
                                                        answerAnonymous ? 'bg-primary' : 'bg-surface-container-high'
                                                    }`}
                                                >
                                                    <div
                                                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out flex items-center justify-center ${
                                                            answerAnonymous ? 'translate-x-6' : 'translate-x-0'
                                                        }`}
                                                    />
                                                </div>
                                                <span className="text-sm font-bold text-on-surface">Post Anonymously</span>
                                            </label>

                                            <div className="flex gap-3 w-full sm:w-auto">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowAnswerForm(false)}
                                                    className="px-6 py-2.5 text-sm font-bold bg-surface-container-low text-on-surface-variant rounded-xl hover:bg-surface-container transition-colors flex-1"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="px-8 py-2.5 text-sm font-bold bg-primary text-white rounded-xl hover:bg-primary/90 shadow-md hover:-translate-y-0.5 transition-all flex-1"
                                                >
                                                    Post Answer
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowAnswerForm(true)}
                                    className="w-full py-6 rounded-3xl bg-primary/5 hover:bg-primary/10 border-2 border-dashed border-primary/20 hover:border-primary/40 text-primary font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow"
                                >
                                    <span className="material-symbols-outlined text-[24px]">edit_square</span>
                                    Write an Answer
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
