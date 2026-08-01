import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { StatusBadge, PriorityBadge } from '../UI/Badge';

export default function ComplaintCard({ grievance }) {
  return (
    <Link href={route('grievances.show-reference', grievance.reference_code)}
      className="block bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:border-red-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">

      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-xs font-bold text-gray-500 tracking-wider bg-gray-100 px-2 py-0.5 rounded-md inline-block w-max">
            #{grievance.reference_code}
          </span>
          <StatusBadge status={grievance.status} />
        </div>
        <div className="shrink-0">
          <PriorityBadge priority={grievance.priority} />
        </div>
      </div>

      <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-1 mb-2 leading-tight">
        {grievance.title}
      </h3>

      <p className="text-sm text-gray-600 font-normal line-clamp-2 mb-4 leading-relaxed">
        {grievance.description}
      </p>

      {grievance.institution && (
        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 bg-gray-50 p-2 rounded-lg border border-gray-100">
            <i className="fa-solid fa-building-columns text-gray-400"></i>
            <span className="truncate">{grievance.institution}</span>
        </div>
      )}

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
        {grievance.social_proof ? (
            <p className="text-xs font-medium text-red-600 italic max-w-[60%] truncate">"{grievance.social_proof}"</p>
        ) : (
            <p className="text-xs font-medium text-gray-400">No updates yet</p>
        )}

        <div className="flex items-center gap-3 shrink-0 text-xs font-bold text-gray-500">
          <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
            <i className="fa-solid fa-arrow-up text-red-500"></i>
            {grievance.upvotes_count || 0}
          </span>
          <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
            <i className="fa-solid fa-comments text-blue-500"></i>
            {grievance.comments_count || 0}
          </span>
        </div>
      </div>
    </Link>
  );
}
