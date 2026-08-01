import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function AdminIndex({ stats, institution }) {
    const metrics = [
        { name: 'Total Students', value: stats.students, icon: 'fa-user-graduate', color: 'bg-blue-50 text-blue-600', href: null, sub: 'Active this semester' },
        { name: 'Teachers', value: stats.teachers, icon: 'fa-chalkboard-user', color: 'bg-purple-50 text-purple-600', href: null },
        { name: 'Semesters', value: stats.semesters, icon: 'fa-layer-group', color: 'bg-orange-50 text-orange-600', href: 'admin.semesters.index', sub: 'Manage Semesters' },
        { name: 'Subjects', value: stats.subjects, icon: 'fa-book-open', color: 'bg-teal-50 text-teal-600', href: 'admin.subjects.index', sub: 'Manage Subjects' },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Admin Dashboard" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                            {institution ? `${institution.name} Overview` : 'Platform Administration'}
                        </h1>
                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                            <i className="fa-solid fa-circle-check text-green-500 text-xs"></i> System is running smoothly
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link href={route('admin.semesters.create')} className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-sm">
                            <i className="fa-solid fa-plus text-xs"></i> New Semester
                        </Link>
                        <Link href={route('admin.subjects.create')} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium text-sm">
                            <i className="fa-solid fa-plus text-xs"></i> New Subject
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {metrics.map((metric) => {
                        const inner = (
                            <>
                                <div className={`w-11 h-11 rounded-lg flex items-center justify-center text-lg ${metric.color}`}>
                                    <i className={`fa-solid ${metric.icon}`}></i>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">{metric.name}</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                                    {metric.sub && (
                                        <p className="text-xs font-medium text-gray-500 mt-0.5">{metric.sub}</p>
                                    )}
                                </div>
                            </>
                        );
                        const className = "bg-white rounded-xl p-5 border border-gray-200 hover:border-indigo-200 transition-all flex items-start gap-4";
                        return metric.href ? (
                            <Link key={metric.name} href={route(metric.href)} className={className}>{inner}</Link>
                        ) : (
                            <div key={metric.name} className={className}>{inner}</div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Institution Context</h3>
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                            <p className="text-gray-600 leading-relaxed mb-4">
                                This dashboard gives you a high-level overview of the academic structure. Use the quick action buttons to easily configure new semesters and subjects for your students.
                            </p>
                            <div className="flex gap-4">
                                <Link href={route('admin.enrollments.index')} className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg shadow-sm hover:border-gray-300 font-medium text-sm transition">
                                    <i className="fa-solid fa-user-graduate text-xs"></i> Manage Enrollments
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
