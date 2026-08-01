import { Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';

export default function Moderation({ flaggedGrievances }) {
  return (
    <SuperAdminLayout activeItem="Moderation">
      <Head title="Moderation Queue" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">Moderation Queue</h1>
          <Link href={route('admin.moderation.comments')}
            className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            Pending Comments
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Ref</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Spam Score</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {flaggedGrievances.data.map(g => (
                <tr key={g.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-indigo-600">{g.reference_code}</td>
                  <td className="px-4 py-3 text-xs text-gray-900">{g.title}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium ${g.hidden_at ? 'text-red-600' : g.moderation_status === 'pending' ? 'text-orange-600' : 'text-green-600'}`}>
                      {g.hidden_at ? 'Hidden' : g.moderation_status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs">{g.spam_score?.toFixed(2) || '—'}</td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    {!g.hidden_at && (
                      <form action={route('admin.moderation.hide', g.id)} method="POST">
                        <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.content} />
                        <button type="submit" className="text-xs text-red-600 hover:text-red-800">Hide</button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SuperAdminLayout>
  );
}