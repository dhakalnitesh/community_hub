import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { StatusBadge, PriorityBadge } from '../../../Components/UI/Badge';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';

export default function Index({ grievances, filters }) {
  return (
    <SuperAdminLayout activeItem="Grievances">
      <Head title="Manage Grievances" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">Manage Grievances</h1>
          <div className="flex items-center gap-2">
            <Link href={route('admin.moderation')}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              Moderation Queue
            </Link>
            <Link href={route('admin.spam-logs')}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              Spam Logs
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Ref</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Priority</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Spam</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Votes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {grievances.data.map(g => (
                <tr key={g.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link href={route('admin.grievances.show', g.id)}
                      className="font-mono text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                      {g.reference_code}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-900 max-w-[200px] truncate">{g.title}</td>
                  <td className="px-4 py-3"><StatusBadge status={g.status} /></td>
                  <td className="px-4 py-3"><PriorityBadge priority={g.priority} /></td>
                  <td className="px-4 py-3">
                    {g.spam_score ? (
                      <span className={`text-xs font-medium ${g.spam_score > 0.7 ? 'text-red-600' : g.spam_score > 0.3 ? 'text-orange-600' : 'text-gray-400'}`}>
                        {g.spam_score.toFixed(2)}
                      </span>
                    ) : <span className="text-xs text-gray-400">—</span>}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{g.bs_created_at}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{g.upvotes_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {grievances.links && grievances.links.length > 3 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            {grievances.links.map((link, i) => {
              if (!link.url) return <span key={i} className="px-2 py-1 text-xs text-gray-400">{link.label}</span>;
              return (
                <Link key={i} href={link.url} preserveState
                  className={`px-2 py-1 text-xs font-medium rounded ${link.active ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </SuperAdminLayout>
  );
}