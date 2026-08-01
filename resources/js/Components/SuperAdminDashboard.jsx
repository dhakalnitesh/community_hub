import { Link, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';

const actions = [
    { name: 'Institutions', description: 'Manage tenants & onboarding', icon: 'fa-building-columns', href: 'admin.institutions', color: 'bg-indigo-50 text-indigo-600' },
    { name: 'Users', description: 'Search & manage all accounts', icon: 'fa-users', href: 'admin.users', color: 'bg-emerald-50 text-emerald-600' },
    { name: 'Roles & Permissions', description: 'Assign roles and guards', icon: 'fa-shield-halved', href: 'admin.roles', color: 'bg-amber-50 text-amber-600' },
    { name: 'Analytics', description: 'Platform wide insights', icon: 'fa-chart-line', href: 'admin.analytics', color: 'bg-sky-50 text-sky-600' },
    { name: 'Reports', description: 'Generate & export reports', icon: 'fa-file-lines', href: 'admin.reports', color: 'bg-violet-50 text-violet-600' },
    { name: 'Monitoring', description: 'System health & alerts', icon: 'fa-heart-pulse', href: 'admin.monitoring', color: 'bg-rose-50 text-rose-600' },
];

export default function SuperAdminDashboard({ stats }) {
    const user = usePage().props.auth.user;

    const metrics = [
        { name: 'Total Subjects', value: stats?.subjects || 0, icon: 'fa-book-open', color: 'bg-indigo-50 text-indigo-600', href: null },
        { name: 'Questions', value: stats?.questions || 0, icon: 'fa-comments', color: 'bg-sky-50 text-sky-600', href: null },
        { name: 'Answers', value: stats?.answers || 0, icon: 'fa-reply', color: 'bg-emerald-50 text-emerald-600', href: null },
        { name: 'Open Grievances', value: stats?.open_grievances || 0, icon: 'fa-flag', color: 'bg-red-50 text-red-600', href: 'admin.grievances.index', sub: `${stats?.resolved_grievances || 0} resolved · ${stats?.critical_grievances || 0} critical` },
    ];

    return (
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Platform Overview</h1>
                    <p className="text-sm text-gray-500 mt-1">Monitor and manage your education platform.</p>
                </div>
                <Link href={route('admin.institutions')} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                    <i className="fa-solid fa-plus text-xs"></i> New Institution
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                {metrics.map((metric) => (
                    <div key={metric.name} className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4">
                        <div className={`w-11 h-11 rounded-lg flex items-center justify-center text-lg ${metric.color}`}>
                            <i className={`fa-solid ${metric.icon}`}></i>
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">{metric.name}</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                            {metric.sub && <p className="text-xs text-gray-500 mt-0.5">{metric.sub}</p>}
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="font-semibold text-gray-900">Quick Actions</h2>
                            <span className="text-xs text-gray-500">Manage the platform</span>
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

                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h2 className="font-semibold text-gray-900 mb-4">Grievances</h2>
                    <div className="space-y-3">
                        <Link href={route('admin.grievances.index')} className="flex justify-between items-center p-3 rounded-lg bg-gray-50 hover:bg-indigo-50 transition-colors">
                            <span className="text-sm text-gray-600">Total</span>
                            <span className="font-bold text-gray-900">{stats?.grievances || 0}</span>
                        </Link>
                        <Link href={route('admin.grievances.index')} className="flex justify-between items-center p-3 rounded-lg bg-red-50 hover:bg-red-100 transition-colors">
                            <span className="text-sm text-red-600">Open</span>
                            <span className="font-bold text-red-600">{stats?.open_grievances || 0}</span>
                        </Link>
                        <Link href={route('admin.grievances.index')} className="flex justify-between items-center p-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors">
                            <span className="text-sm text-emerald-600">Resolved</span>
                            <span className="font-bold text-emerald-600">{stats?.resolved_grievances || 0}</span>
                        </Link>
                        <Link href={route('admin.grievances.index')} className="flex justify-between items-center p-3 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors">
                            <span className="text-sm text-amber-600">Critical</span>
                            <span className="font-bold text-amber-600">{stats?.critical_grievances || 0}</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
