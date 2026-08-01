import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Dashboard({ stats }) {
    const displayStats = stats || { questions: 0, answers: 0, subjects: 0, grievances: 0, open_grievances: 0, resolved_grievances: 0, critical_grievances: 0 };
    const { auth } = usePage().props;
    const user = auth?.user || { name: 'Student' };
    const firstName = user.name.split(' ')[0];

    const metrics = [
        { name: 'Enrolled Subjects', value: displayStats.subjects, icon: 'fa-book-open', color: 'bg-indigo-50 text-indigo-600', href: route('student.subjects') },
        { name: 'Questions Asked', value: displayStats.questions, icon: 'fa-comments', color: 'bg-sky-50 text-sky-600', href: route('questions.index') },
        { name: 'Helpful Answers', value: displayStats.answers, icon: 'fa-reply', color: 'bg-emerald-50 text-emerald-600', href: null },
        { name: 'Grievances', value: displayStats.grievances, icon: 'fa-flag', color: 'bg-red-50 text-red-600', href: route('grievances.create'), sub: `${displayStats.open_grievances} open` },
    ];

    return (
        <AuthenticatedLayout header="Dashboard">
            <Head title="Student Dashboard" />

            <div className="max-w-7xl mx-auto space-y-8 pb-12">
                <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mt-4">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                            Welcome back, {firstName}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">Here's an overview of your academic progress.</p>
                    </div>
                    <Link href={route('grievances.create')} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                        <i className="fa-solid fa-flag text-xs"></i> Report Grievance
                    </Link>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                            <Link key={metric.name} href={metric.href} className={className}>{inner}</Link>
                        ) : (
                            <div key={metric.name} className={className}>{inner}</div>
                        );
                    })}
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex flex-col md:flex-row items-start justify-between gap-8">
                                <div className="flex-1">
                                    <h4 className="text-lg font-bold text-gray-900 mb-2">Community Discussions</h4>
                                    <p className="text-sm text-gray-500 mb-6">Connect with peers and teachers. Ask questions or help others solve problems.</p>
                                    <Link href={route('questions.index')} className="inline-flex items-center gap-2 bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                                        <i className="fa-solid fa-plus text-xs"></i> New Discussion
                                    </Link>
                                </div>
                                <div className="w-full md:w-1/2 bg-gray-50 rounded-xl p-5 border border-gray-200">
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Trending Topics</p>
                                    <div className="space-y-3">
                                        <Link href={route('questions.index')} className="flex items-center justify-between gap-4 group">
                                            <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">Data Normalization Techniques</p>
                                            <span className="text-xs bg-white text-gray-500 px-2 py-1 rounded-md flex items-center gap-1 border border-gray-200"><i className="fa-solid fa-comments text-[10px]"></i> 12</span>
                                        </Link>
                                        <Link href={route('questions.index')} className="flex items-center justify-between gap-4 group">
                                            <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">Understanding Polymorphism</p>
                                            <span className="text-xs bg-white text-gray-500 px-2 py-1 rounded-md flex items-center gap-1 border border-gray-200"><i className="fa-solid fa-comments text-[10px]"></i> 8</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="text-lg font-bold text-gray-900">Upcoming Assignments</h4>
                                <Link href={route('assignments.index')} className="text-sm font-medium text-indigo-600 hover:underline">View All</Link>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="border border-gray-200 rounded-xl p-5 hover:border-indigo-300 transition-colors">
                                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md mb-3 inline-block">DUE TOMORROW</span>
                                    <h5 className="font-semibold text-gray-900 text-base">Java OOP Project</h5>
                                    <p className="text-sm text-gray-500 mt-2 mb-4">Status: Not Submitted</p>
                                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                        <div className="bg-indigo-600 h-full w-[25%]"></div>
                                    </div>
                                </div>
                                <div className="border border-gray-200 rounded-xl p-5 hover:border-indigo-300 transition-colors">
                                    <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md mb-3 inline-block">IN 3 DAYS</span>
                                    <h5 className="font-semibold text-gray-900 text-base">DB Normalization Quiz</h5>
                                    <p className="text-sm text-gray-500 mt-2 mb-4">Status: In Progress</p>
                                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                        <div className="bg-indigo-600 h-full w-[60%]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h4 className="text-lg font-bold text-gray-900 mb-6">Learning Insights</h4>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Strong Topics</p>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium flex items-center gap-1.5 border border-emerald-200">
                                            <i className="fa-solid fa-circle-check text-xs"></i> OOP
                                        </span>
                                        <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium flex items-center gap-1.5 border border-emerald-200">
                                            <i className="fa-solid fa-circle-check text-xs"></i> HTML/CSS
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Needs Focus</p>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium flex items-center gap-1.5 border border-red-200">
                                            <i className="fa-solid fa-circle-exclamation text-xs"></i> Recursion
                                        </span>
                                        <span className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium flex items-center gap-1.5 border border-red-200">
                                            <i className="fa-solid fa-circle-exclamation text-xs"></i> SQL Joins
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h4 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h4>
                            <div className="space-y-6">
                                <div className="relative flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                        <i className="fa-solid fa-check-double text-sm"></i>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Submitted Java Assignment</p>
                                        <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                                    </div>
                                </div>
                                <div className="relative flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                                        <i className="fa-solid fa-upload text-sm"></i>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Prof. Sharma added Notes</p>
                                        <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
                                    </div>
                                </div>
                                <div className="relative flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                        <i className="fa-solid fa-award text-sm"></i>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Earned 'Top Contributor'</p>
                                        <p className="text-xs text-gray-500 mt-1">Yesterday</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
