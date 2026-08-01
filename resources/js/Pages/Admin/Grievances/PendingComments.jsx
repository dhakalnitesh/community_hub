import { Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';

export default function PendingComments({ comments }) {
  const { post } = useForm();

  function approve(id) {
    post(route('admin.moderation.comments.approve', id), { preserveScroll: true });
  }

  function hide(id) {
    post(route('admin.moderation.comments.hide', id), { preserveScroll: true });
  }

  return (
    <SuperAdminLayout activeItem="Moderation">
      <Head title="Pending Comments" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Pending Comments</h1>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Comment</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Author</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Grievance</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {comments.data.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-xs text-gray-700 max-w-[300px] truncate">{c.body}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{c.author}</td>
                  <td className="px-4 py-3 text-xs text-indigo-600">{c.grievance_title}</td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <button onClick={() => approve(c.id)}
                      className="text-xs text-green-600 hover:text-green-800">Approve</button>
                    <button onClick={() => hide(c.id)}
                      className="text-xs text-red-600 hover:text-red-800">Hide</button>
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