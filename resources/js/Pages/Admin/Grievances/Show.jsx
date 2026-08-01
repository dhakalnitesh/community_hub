import { Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { StatusBadge, PriorityBadge } from '../../../Components/UI/Badge';

export default function Show({ grievance, staff }) {
  const { data, setData, post, patch, processing } = useForm({
    status: grievance.status,
    admin_priority: grievance.admin_priority || grievance.priority,
    assigned_to: grievance.assigned_to || '',
    resolution_summary: grievance.resolution_summary || '',
  });

  function handleStatusChange(e) {
    setData('status', e.target.value);
    patch(route('admin.grievances.update-status', grievance.id), {
      data: { status: e.target.value, resolution_summary: data.resolution_summary },
      preserveScroll: true,
    });
  }

  function handlePriorityChange(e) {
    setData('admin_priority', e.target.value);
    post(route('admin.grievances.update-priority', grievance.id), {
      data: { admin_priority: e.target.value },
      preserveScroll: true,
    });
  }

  function handleAssign(e) {
    setData('assigned_to', e.target.value);
    if (e.target.value) {
      post(route('admin.grievances.assign', grievance.id), {
        data: { assigned_to: e.target.value },
        preserveScroll: true,
      });
    }
  }

  return (
    <>
      <Head title={`${grievance.reference_code}`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link href={route('admin.grievances.index')}
            className="text-xs text-gray-500 hover:text-gray-700">
            &larr; Back to grievances
          </Link>
          <span className="text-gray-300">|</span>
          <span className="font-mono text-sm font-bold text-indigo-600">{grievance.reference_code}</span>
          <StatusBadge status={grievance.status} />
          <PriorityBadge priority={grievance.priority} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h1 className="text-lg font-bold text-gray-900">{grievance.title}</h1>
              <p className="text-sm text-gray-700 mt-3 whitespace-pre-wrap">{grievance.description}</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-gray-100">
                <div><p className="text-[10px] text-gray-400">Institution</p><p className="text-xs font-medium">{grievance.institution}</p></div>
                <div><p className="text-[10px] text-gray-400">Semester</p><p className="text-xs font-medium">{grievance.semester || '—'}</p></div>
                <div><p className="text-[10px] text-gray-400">Subject</p><p className="text-xs font-medium">{grievance.subject || '—'}</p></div>
                <div><p className="text-[10px] text-gray-400">Created</p><p className="text-xs font-medium">{grievance.bs_created_at}</p></div>
              </div>

              {grievance.media && grievance.media.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-500 mb-2">Attachments</p>
                  <div className="flex gap-2 flex-wrap">
                    {grievance.media.filter(m => m.type === 'photo').map(m => (
                      <img key={m.id} src={m.url} className="w-20 h-20 object-cover rounded-lg border" alt="" />
                    ))}
                  </div>
                </div>
              )}

              {grievance.spam_score && (
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-500">Spam Score: <span className={`font-bold ${grievance.spam_score > 0.7 ? 'text-red-600' : grievance.spam_score > 0.3 ? 'text-orange-600' : 'text-green-600'}`}>
                    {grievance.spam_score.toFixed(2)}
                  </span></p>
                </div>
              )}
            </div>

            {grievance.events && grievance.events.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h2 className="text-sm font-bold text-gray-900 mb-3">Events</h2>
                <div className="space-y-2">
                  {grievance.events.slice(0, 20).map((event, i) => (
                    <div key={event.id || i} className="flex items-start gap-2 text-xs">
                      <div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-indigo-400 shrink-0" />
                      <div>
                        <p className="text-gray-700">{event.description}</p>
                        <p className="text-gray-400 text-[10px]">{event.bs_created_at}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h2 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider">Actions</h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                  <select value={data.status} onChange={handleStatusChange}
                    className="w-full text-xs rounded-lg border-gray-300 border px-2 py-1.5 focus:ring-2 focus:ring-indigo-500 outline-none">
                    <option value="received">Received</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Priority {grievance.user_priority && grievance.user_priority !== grievance.admin_priority && (
                      <span className="text-orange-500">(User: {grievance.user_priority})</span>
                    )}
                  </label>
                  <select value={data.admin_priority} onChange={handlePriorityChange}
                    className="w-full text-xs rounded-lg border-gray-300 border px-2 py-1.5 focus:ring-2 focus:ring-indigo-500 outline-none">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Assign To</label>
                  <select value={data.assigned_to} onChange={handleAssign}
                    className="w-full text-xs rounded-lg border-gray-300 border px-2 py-1.5 focus:ring-2 focus:ring-indigo-500 outline-none">
                    <option value="">Unassigned</option>
                    {staff.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                {data.status === 'resolved' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Resolution Summary</label>
                    <textarea value={data.resolution_summary} onChange={e => setData('resolution_summary', e.target.value)}
                      rows={3}
                      className="w-full text-xs rounded-lg border-gray-300 border px-2 py-1.5 focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h2 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider">Stats</h2>
              <div className="space-y-1 text-xs">
                <p className="flex justify-between"><span className="text-gray-500">Upvotes</span><span>{grievance.upvotes_count}</span></p>
                <p className="flex justify-between"><span className="text-gray-500">Comments</span><span>{grievance.comments_count}</span></p>
                <p className="flex justify-between"><span className="text-gray-500">Anonymous</span><span>{grievance.is_anonymous ? 'Yes' : 'No'}</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}