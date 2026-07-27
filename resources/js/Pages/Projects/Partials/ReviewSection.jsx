import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { MessageSquare, Star, Send, Loader2 } from 'lucide-react';

export default function ReviewSection({ project, auth }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const { data, setData, post, processing, reset, errors } = useForm({
        content: '',
        is_endorsed: false,
    });

    const isTeacherOrAdmin = auth.user.roles?.includes('teacher') || auth.user.roles?.includes('institution_admin') || auth.user.roles?.includes('super_admin') || true; // Adjust based on roles logic

    const submit = (e) => {
        e.preventDefault();
        post(route('projects.reviews.store', project.id), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <div className="mt-4 border-t border-gray-100 pt-4">
            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition"
            >
                <MessageSquare size={16} /> 
                {project.reviews?.length || 0} {project.reviews?.length === 1 ? 'Review' : 'Reviews'}
            </button>

            {isExpanded && (
                <div className="mt-4 space-y-4 animate-in slide-in-from-top-2">
                    {/* List Reviews */}
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                        {project.reviews?.length === 0 ? (
                            <p className="text-xs text-gray-500 italic">No feedback yet. Be the first to review!</p>
                        ) : (
                            project.reviews.map(review => (
                                <div key={review.id} className={`p-3 rounded-lg text-sm ${review.is_endorsed ? 'bg-amber-50 border border-amber-200' : 'bg-gray-50 border border-gray-100'}`}>
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-semibold text-gray-900 flex items-center gap-1">
                                            {review.user.name}
                                            {review.is_endorsed && <Star size={12} className="text-amber-500 fill-amber-500" />}
                                        </span>
                                    </div>
                                    <p className="text-gray-700">{review.content}</p>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Review Form */}
                    {isTeacherOrAdmin && (
                        <form onSubmit={submit} className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                            <div>
                                <textarea
                                    value={data.content}
                                    onChange={e => setData('content', e.target.value)}
                                    placeholder="Add constructive feedback..."
                                    className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    rows="2"
                                    required
                                />
                                {errors.content && <p className="text-xs text-red-600 mt-1">{errors.content}</p>}
                            </div>
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={data.is_endorsed}
                                        onChange={e => setData('is_endorsed', e.target.checked)}
                                        className="rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                                    />
                                    <span className="flex items-center gap-1">Endorse Project <Star size={14} className="text-amber-500" /></span>
                                </label>
                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded hover:bg-indigo-700 disabled:opacity-50 transition"
                                >
                                    {processing ? <Loader2 size={14} className="animate-spin mr-1" /> : <Send size={14} className="mr-1" />}
                                    Submit
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
}
