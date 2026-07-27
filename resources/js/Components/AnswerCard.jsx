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
        <div className={`rounded-2xl p-6 transition-all duration-300 ${answer.is_accepted ? 'bg-green-50/80 backdrop-blur-md border-2 border-green-500/30 shadow-[0_8px_30px_rgba(34,197,94,0.12)]' : 'bg-white/80 backdrop-blur-md border border-white shadow-[0_4px_20px_rgb(0,0,0,0.03)]'}`}>
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
                    {answer.is_accepted && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider mb-4 shadow-sm mr-2">
                            <span className="material-symbols-outlined text-[14px]">verified</span>
                            Accepted Answer
                        </div>
                    )}
                    {answer.is_teacher_endorsed && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary text-white rounded-lg text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
                            <span className="material-symbols-outlined text-[14px]">stars</span>
                            Teacher Endorsed
                        </div>
                    )}

                    {isEditing ? (
                        <form onSubmit={handleUpdate} className="mb-4">
                            <textarea
                                value={editBody}
                                onChange={(e) => setEditBody(e.target.value)}
                                className="w-full bg-surface-container-lowest border border-surface-container-low text-on-surface rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium resize-y"
                                rows={4}
                            />
                            <div className="mt-3 flex gap-3">
                                <button type="button" onClick={() => setIsEditing(false)} className="px-5 py-2 text-sm font-bold bg-surface-container-low text-on-surface-variant rounded-xl hover:bg-surface-container transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="px-5 py-2 text-sm font-bold bg-primary text-white rounded-xl hover:bg-primary/90 transition-all shadow-sm">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    ) : (
                        <p className="text-on-surface-variant font-medium whitespace-pre-wrap leading-relaxed mb-6">{answer.body}</p>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-surface-container-low/50">
                        <div className="flex items-center gap-4 text-xs font-medium text-on-surface-variant">
                            <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${answer.is_accepted ? 'bg-green-500/20 text-green-700' : 'bg-primary/10 text-primary'}`}>
                                    {answer.author_name?.charAt(0) || 'U'}
                                </div>
                                <span className="text-on-surface font-bold">{answer.author_name}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-outline">
                                <span className="material-symbols-outlined text-[14px]">schedule</span>
                                <span>{new Date(answer.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            {canAccept && !answer.is_accepted && (
                                <button onClick={handleAccept} className="px-3 py-1.5 rounded-lg text-xs font-bold text-green-700 bg-green-500/10 hover:bg-green-500/20 transition-colors flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">check</span> Accept
                                </button>
                            )}
                            {canAccept && answer.is_accepted && (
                                <button onClick={handleAccept} className="px-3 py-1.5 rounded-lg text-xs font-bold text-yellow-700 bg-yellow-500/10 hover:bg-yellow-500/20 transition-colors flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">close</span> Unaccept
                                </button>
                            )}
                            {answer.permissions?.endorse && !answer.is_teacher_endorsed && (
                                <button onClick={handleEndorse} className="px-3 py-1.5 rounded-lg text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 transition-colors flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">stars</span> Endorse
                                </button>
                            )}
                            {answer.permissions?.endorse && answer.is_teacher_endorsed && (
                                <button onClick={handleEndorse} className="px-3 py-1.5 rounded-lg text-xs font-bold text-yellow-700 bg-yellow-500/10 hover:bg-yellow-500/20 transition-colors flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">close</span> Unendorse
                                </button>
                            )}
                            {canUpdate && !isEditing && (
                                <button onClick={() => setIsEditing(true)} className="px-3 py-1.5 rounded-lg text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 transition-colors flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">edit</span> Edit
                                </button>
                            )}
                            {canDelete && (
                                <button onClick={handleDelete} className="px-3 py-1.5 rounded-lg text-xs font-bold text-error bg-error/10 hover:bg-error/20 transition-colors flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">delete</span> Delete
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
