import { Link } from '@inertiajs/react';

export default function QuestionCard({ discussion }) {
    const statusConfig = {
        open: { color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'fa-lock-open' },
        answered: { color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', icon: 'fa-circle-check' },
        closed: { color: 'text-gray-600', bg: 'bg-gray-100', border: 'border-gray-200', icon: 'fa-lock' },
    };

    const currentStatus = statusConfig[discussion.status] || statusConfig.open;

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:border-indigo-300 hover:shadow-md transition-all duration-300 group">
            <div className="flex flex-col gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md flex items-center gap-1 border ${currentStatus.bg} ${currentStatus.color} ${currentStatus.border}`}>
                            <i className={`fa-solid ${currentStatus.icon} text-[10px]`}></i>
                            {discussion.status}
                        </span>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-100 px-2.5 py-1 rounded-md">
                            {discussion.discussionable_type === 'subject'
                                ? discussion.discussionable?.name
                                : discussion.discussionable_type}
                        </span>
                    </div>

                    <Link
                        href={route('questions.show', discussion.id)}
                        className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-tight mb-2"
                    >
                        {discussion.title}
                    </Link>

                    <p className="text-sm text-gray-600 line-clamp-2 font-normal mb-4">
                        {discussion.body}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-gray-500 mt-2">
                        <div className="flex items-center gap-1.5 mr-2">
                            <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-[10px] font-bold">
                                {discussion.author_name?.charAt(0) || 'U'}
                            </div>
                            <span className="text-gray-900 font-semibold">{discussion.author_name}</span>
                        </div>

                        <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md border border-gray-100 text-gray-600">
                            <i className="fa-solid fa-caret-up text-sm text-emerald-500"></i>
                            <span className="font-bold">{discussion.upvotes_count - discussion.downvotes_count} votes</span>
                        </div>

                        <div className="flex items-center gap-1">
                            <i className="fa-solid fa-comments text-sm text-gray-400"></i>
                            <span>{discussion.answers_count} {discussion.answers_count === 1 ? 'answer' : 'answers'}</span>
                        </div>

                        <div className="flex items-center gap-1">
                            <i className="fa-solid fa-clock text-sm text-gray-400"></i>
                            <span>{new Date(discussion.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
