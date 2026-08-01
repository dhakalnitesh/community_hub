import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import TeacherDashboard from '@/Components/TeacherDashboard';
import SuperAdminDashboard from '@/Components/SuperAdminDashboard';
import InstitutionAdminDashboard from '@/Components/InstitutionAdminDashboard';


export default function Dashboard({ stats, recentSubmissions, recentQuestions }) {
    const user = usePage().props.auth.user;

    if (user?.role === 'teacher') {
        return (
            <AuthenticatedLayout>
                <Head title="Dashboard - Teacher" />
                <TeacherDashboard 
                    stats={stats} 
                    recentSubmissions={recentSubmissions} 
                    recentQuestions={recentQuestions} 
                />
            </AuthenticatedLayout>
        );
    }

    if (user?.role === 'super_admin') {
        return (
            <AuthenticatedLayout>
                <Head title="Dashboard - Super Admin" />
                <SuperAdminDashboard stats={stats} />
            </AuthenticatedLayout>
        );
    }

    if (user?.role === 'institution_admin') {
        return (
            <AuthenticatedLayout>
                <Head title="Dashboard - Institution Admin" />
                <InstitutionAdminDashboard stats={stats} />
            </AuthenticatedLayout>
        );
    }

    const fallbackStats = stats || { questions: 0, answers: 0, subjects: 0, grievances: 0, open_grievances: 0, resolved_grievances: 0, critical_grievances: 0 };
    const metrics = [
        { name: 'Questions', value: fallbackStats.questions, icon: 'fa-comments', color: 'bg-indigo-50 text-indigo-600' },
        { name: 'Answers', value: fallbackStats.answers, icon: 'fa-reply', color: 'bg-emerald-50 text-emerald-600' },
        { name: 'Subjects', value: fallbackStats.subjects, icon: 'fa-book-open', color: 'bg-sky-50 text-sky-600' },
        { name: 'Grievances', value: fallbackStats.grievances, icon: 'fa-flag', color: 'bg-red-50 text-red-600', sub: `${fallbackStats.open_grievances} open · ${fallbackStats.resolved_grievances} resolved` },
    ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">Dashboard</h2>
            }
        >
            <Head title="Dashboard" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
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

                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900">Quick Actions</h3>
                    </div>
                    <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link
                            href={route('questions.index')}
                            className="flex items-start gap-3 p-4 bg-indigo-50 rounded-lg border border-indigo-100 hover:bg-indigo-100 transition-colors"
                        >
                            <div className="w-10 h-10 rounded-lg bg-white text-indigo-600 flex items-center justify-center"><i className="fa-solid fa-comments"></i></div>
                            <div>
                                <div className="font-medium text-indigo-700">Browse Questions</div>
                                <div className="text-sm text-indigo-500 mt-1">View and answer questions in your subjects</div>
                            </div>
                        </Link>
                        <Link
                            href={route('questions.index')}
                            className="flex items-start gap-3 p-4 bg-emerald-50 rounded-lg border border-emerald-100 hover:bg-emerald-100 transition-colors"
                        >
                            <div className="w-10 h-10 rounded-lg bg-white text-emerald-600 flex items-center justify-center"><i className="fa-solid fa-plus"></i></div>
                            <div>
                                <div className="font-medium text-emerald-700">Ask a Question</div>
                                <div className="text-sm text-emerald-500 mt-1">Post anonymously or publicly</div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
