import { router, usePage } from '@inertiajs/react';
import VoteButtons from '@/Components/VoteButtons';
import { useState } from 'react';

export default function AnswerCard({ answer, discussionUserId, canAccept }) {
    const { auth } = usePage().props;
    const [isEditing, setIsEditing] = useState(false);
    const [editBody, setEditBody] = useState(answer.body);

    const isOwner = auth.user.id === answer.user_id;
    const canUpdate = answer.permissions?.update || false;
    const canDelete = answer.permissions?.delete || false;

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this answer?')) {
            router.delete(route('questions.answers.destroy', answer.id));
        }
    };

    const handleAccept = () => {
        router.post(route('questions.answers.accept', answer.id));
    };

    const handleEndorse = () => {
        router.post(route('questions.answers.endorse', answer.id));
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        router.put(route('questions.answers.update', answer.id), {
            body: editBody,
            is_anonymous: answer.is_anonymous,
        });
        setIsEditing(false);
    };

    return (
        <div className={`rounded-xl p-6 transition-all duration-300 ${answer.is_accepted ? 'bg-emerald-50/80 border-2 border-emerald-200' : 'bg-white border border-gray-200 shadow-sm'}`}>
            <div className="flex flex-col sm:flex-row gap-6">
                <div className="shrink-0 flex sm:flex-col items-center sm:items-start gap-4">
                    <VoteButtons
                        votableType="discussion_answer"
                        votableId={answer.id}
                        upvotes={answer.upvotes_count}
                        downvotes={answer.downvotes_count}
                    />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="mb-4 flex flex-wrap gap-2">
                        {answer.is_accepted && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm">
                                <i className="fa-solid fa-circle-check text-sm"></i>
                                Accepted Answer
                            </span>
                        )}
                        {answer.is_teacher_endorsed && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm">
                                <i className="fa-solid fa-star text-sm"></i>
                                Teacher Endorsed
                            </span>
                        )}
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleUpdate} className="mb-4">
                            <textarea
                                value={editBody}
                                onChange={(e) => setEditBody(e.target.value)}
                                className="w-full rounded-lg border-slate-300 px-3 py-1.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 resize-y"
                                rows={4}
                            />
                            <div className="mt-3 flex gap-3">
                                <button type="button" onClick={() => setIsEditing(false)} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    ) : (
                        <p className="text-gray-600 font-normal whitespace-pre-wrap leading-relaxed mb-6">{answer.body}</p>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                            <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${answer.is_accepted ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'}`}>
                                    {answer.author_name?.charAt(0) || 'U'}
                                </div>
                                <span className="text-gray-900 font-bold">{answer.author_name}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-400">
                                <i className="fa-solid fa-clock text-xs"></i>
                                <span>{new Date(answer.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            {canAccept && !answer.is_accepted && (
                                <button onClick={handleAccept} className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors">
                                    <i className="fa-solid fa-check text-xs"></i> Accept
                                </button>
                            )}
                            {canAccept && answer.is_accepted && (
                                <button onClick={handleAccept} className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold text-yellow-700 bg-yellow-50 hover:bg-yellow-100 transition-colors">
                                    <i className="fa-solid fa-xmark text-xs"></i> Unaccept
                                </button>
                            )}
                            {answer.permissions?.endorse && !answer.is_teacher_endorsed && (
                                <button onClick={handleEndorse} className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors">
                                    <i className="fa-solid fa-star text-xs"></i> Endorse
                                </button>
                            )}
                            {answer.permissions?.endorse && answer.is_teacher_endorsed && (
                                <button onClick={handleEndorse} className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold text-yellow-700 bg-yellow-50 hover:bg-yellow-100 transition-colors">
                                    <i className="fa-solid fa-xmark text-xs"></i> Unendorse
                                </button>
                            )}
                            {canUpdate && !isEditing && (
                                <button onClick={() => setIsEditing(true)} className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors">
                                    <i className="fa-solid fa-pen text-xs"></i> Edit
                                </button>
                            )}
                            {canDelete && (
                                <button onClick={handleDelete} className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors">
                                    <i className="fa-solid fa-trash text-xs"></i> Delete
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
