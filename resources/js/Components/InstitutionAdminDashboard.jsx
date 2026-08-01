import { Link, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';

const actions = [
    { name: 'Manage Semesters', description: 'Create & configure semesters', icon: 'fa-layer-group', href: 'admin.semesters.index', color: 'bg-indigo-50 text-indigo-600' },
    { name: 'Manage Subjects', description: 'Subjects, sections & teachers', icon: 'fa-book-open', href: 'admin.subjects.index', color: 'bg-sky-50 text-sky-600' },
    { name: 'Enroll Students', description: 'Assign students to semesters', icon: 'fa-user-graduate', href: 'admin.enrollments.index', color: 'bg-emerald-50 text-emerald-600' },
    { name: 'Announcements', description: 'Notify your institution', icon: 'fa-bullhorn', href: 'announcements.index', color: 'bg-amber-50 text-amber-600' },
];

export default function InstitutionAdminDashboard({ stats }) {
    const user = usePage().props.auth.user;

    const metrics = [
        { name: 'Subjects', value: stats?.subjects || 0, icon: 'fa-book-open', color: 'bg-indigo-50 text-indigo-600', href: 'admin.subjects.index' },
        { name: 'Questions', value: stats?.questions || 0, icon: 'fa-comments', color: 'bg-sky-50 text-sky-600', href: 'questions.index' },
        { name: 'Answers', value: stats?.answers || 0, icon: 'fa-reply', color: 'bg-emerald-50 text-emerald-600', href: null },
        { name: 'Semesters', value: stats?.semesters || 0, icon: 'fa-layer-group', color: 'bg-violet-50 text-violet-600', href: 'admin.semesters.index' },
        { name: 'Grievances', value: stats?.grievances || 0, icon: 'fa-flag', color: 'bg-amber-50 text-amber-600', href: 'admin.grievances.index', sub: `${stats?.open_grievances || 0} open` },
        { name: 'Critical', value: stats?.critical_grievances || 0, icon: 'fa-triangle-exclamation', color: 'bg-red-50 text-red-600', href: 'admin.grievances.index' },
    ];

    return (
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name || 'Administrator'}</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your institution and monitor academic performance.</p>
                </div>
                <Link href={route('announcements.index')} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                    <i className="fa-solid fa-bullhorn text-xs"></i> New Announcement
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
                {metrics.map((metric) => {
                    const inner = (
                        <>
                            <div className={`w-11 h-11 rounded-lg flex items-center justify-center text-lg ${metric.color}`}>
                                <i className={`fa-solid ${metric.icon}`}></i>
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">{metric.name}</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                                {metric.sub && <p className="text-xs text-gray-500 mt-0.5">{metric.sub}</p>}
                            </div>
                        </>
                    );
                    const className = "bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4 hover:border-indigo-300 transition-colors";
                    return metric.href ? (
                        <Link key={metric.name} href={route(metric.href)} className={className}>{inner}</Link>
                    ) : (
                        <div key={metric.name} className={className}>{inner}</div>
                    );
                })}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="font-semibold text-gray-900">Quick Actions</h2>
                    <span className="text-xs text-gray-500">Common tasks</span>
                </div>
                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {actions.map((action) => (
                        <Link
                            key={action.name}
                            href={route(action.href)}
                            className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors"
                        >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-base ${action.color}`}>
                                <i className={`fa-solid ${action.icon}`}></i>
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-900">{action.name}</p>
                                <p className="text-xs text-gray-500 truncate">{action.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
