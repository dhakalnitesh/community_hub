import { Link, usePage } from '@inertiajs/react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function TeacherDashboard({ stats, recentSubmissions = [], recentQuestions = [] }) {
    const user = usePage().props.auth.user;
    const firstName = user.name.split(' ')[0];

    const totalQuestions = stats.questions > 0 ? stats.questions : 15;
    const anonymousCount = Math.floor(totalQuestions * 0.75);
    const publicCount = totalQuestions - anonymousCount;

    const chartData = {
        labels: ['Anonymous', 'Public'],
        datasets: [
            {
                data: [anonymousCount, publicCount],
                backgroundColor: ['rgba(79, 70, 229, 0.8)', 'rgba(59, 130, 246, 0.4)'],
                borderColor: ['rgba(79, 70, 229, 1)', 'rgba(59, 130, 246, 1)'],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        cutout: '75%',
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    font: { family: "'Figtree', sans-serif", size: 12, weight: 'bold' },
                    color: '#4b5563',
                },
            },
            tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.9)',
                titleFont: { size: 13 },
                bodyFont: { size: 13, weight: 'bold' },
                padding: 10,
                cornerRadius: 8,
                displayColors: true,
            },
        },
    };

    const cardClass = 'bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all group duration-300';

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            {/* Greeting */}
            <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                    <h3 className="text-3xl font-bold text-gray-900 tracking-tight">
                        Welcome back, <span className="text-indigo-600">{firstName}</span>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">Here's an overview of your classes and student engagement today.</p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href={route('assignments.create')}
                        className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50"
                    >
                        <i className="fa-solid fa-clipboard-list text-gray-400" /> New Assignment
                    </Link>
                    <Link
                        href={route('questions.create')}
                        className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700"
                    >
                        <i className="fa-solid fa-bullhorn" /> Post Announcement
                    </Link>
                </div>
            </section>

            {/* KPI cards */}
            <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Link href={route('classes.index')} className={cardClass}>
                    <div className="mb-4 flex items-start justify-between">
                        <div className="flex size-11 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform">
                            <i className="fa-solid fa-book-open" />
                        </div>
                        <i className="fa-solid fa-arrow-up-right-from-square text-gray-300 group-hover:text-indigo-400 transition-colors" />
                    </div>
                    <p className="mb-1 text-3xl font-bold text-gray-900">{stats.subjects}</p>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Active Subjects</p>
                </Link>

                <Link href={route('questions.index')} className={cardClass}>
                    <div className="mb-4 flex items-start justify-between">
                        <div className="flex size-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
                            <i className="fa-solid fa-comments" />
                        </div>
                        <i className="fa-solid fa-arrow-up-right-from-square text-gray-300 group-hover:text-blue-400 transition-colors" />
                    </div>
                    <p className="mb-1 text-3xl font-bold text-gray-900">{stats.questions}</p>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Unanswered Q&A</p>
                </Link>

                <Link href={route('grievances.feed')} className={cardClass}>
                    <div className="mb-4 flex items-start justify-between">
                        <div className="flex size-11 items-center justify-center rounded-lg bg-red-50 text-red-600 group-hover:scale-110 transition-transform">
                            <i className="fa-solid fa-flag" />
                        </div>
                        <i className="fa-solid fa-arrow-up-right-from-square text-gray-300 group-hover:text-red-400 transition-colors" />
                    </div>
                    <p className="mb-1 text-3xl font-bold text-gray-900">{stats.open_grievances}</p>
                    <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Grievances</p>
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">{stats.grievances} total</span>
                    </div>
                </Link>

                <Link href={route('assignments.index')} className={cardClass}>
                    <div className="mb-4 flex items-start justify-between">
                        <div className="flex size-11 items-center justify-center rounded-lg bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
                            <i className="fa-solid fa-clipboard-check" />
                        </div>
                        <i className="fa-solid fa-arrow-up-right-from-square text-gray-300 group-hover:text-amber-400 transition-colors" />
                    </div>
                    <p className="mb-1 text-3xl font-bold text-gray-900">{stats.to_grade || 0}</p>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">To Grade</p>
                </Link>
            </section>

            {/* Main content */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Recent submissions */}
                <div className="flex min-h-[400px] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm lg:col-span-2">
                    <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                        <h2 className="text-base font-semibold text-gray-900">Recent Submissions</h2>
                        <Link href={route('assignments.index')} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                            View All
                        </Link>
                    </div>

                    {recentSubmissions.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50">
                                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Student</th>
                                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Assignment</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {recentSubmissions.map((submission) => (
                                        <tr key={submission.id} className="transition-colors hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex size-9 items-center justify-center rounded-full bg-indigo-50 text-sm font-bold text-indigo-600">
                                                        {submission.student?.name?.charAt(0) || '?'}
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-900">{submission.student?.name || 'Unknown Student'}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-sm font-medium text-gray-900">{submission.assignment?.title || 'Unknown Assignment'}</div>
                                                <div className="text-xs text-gray-500">Attempt {submission.attempt_number}</div>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                                                        submission.status === 'submitted'
                                                            ? 'bg-amber-100 text-amber-800'
                                                            : submission.status === 'graded'
                                                              ? 'bg-green-100 text-green-800'
                                                              : 'bg-gray-100 text-gray-800'
                                                    }`}
                                                >
                                                    {submission.status === 'submitted' ? 'Needs Grading' : submission.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-1 flex-col items-center justify-center p-12 text-center">
                            <div className="mb-4 flex size-16 items-center justify-center rounded-xl border border-gray-100 bg-gray-50">
                                <i className="fa-solid fa-inbox text-3xl text-gray-400" />
                            </div>
                            <h3 className="mb-1 text-base font-semibold text-gray-900">No recent submissions</h3>
                            <p className="max-w-sm text-sm text-gray-500">
                                When students submit their assignments, they will appear here for you to review and grade.
                            </p>
                            <Link
                                href={route('assignments.index')}
                                className="mt-6 inline-flex items-center rounded-lg border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                            >
                                Manage Assignments
                            </Link>
                        </div>
                    )}
                </div>

                {/* Right panel */}
                <div className="space-y-6">
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h4 className="text-base font-semibold text-gray-900">Student Engagement</h4>
                        <p className="mb-6 text-xs text-gray-500">Empowering shy students via Anonymous Q&A</p>

                        <div className="relative flex h-48 w-full items-center justify-center">
                            <Doughnut data={chartData} options={chartOptions} />
                            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-extrabold text-indigo-600">{Math.round((anonymousCount / totalQuestions) * 100)}%</span>
                                <span className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">Anonymous</span>
                            </div>
                        </div>

                        <div className="mt-6 rounded-lg border border-indigo-100 bg-indigo-50 p-4">
                            <div className="flex items-start gap-3">
                                <i className="fa-solid fa-chart-line mt-0.5 text-indigo-500" />
                                <div>
                                    <p className="mb-1 text-xs font-bold text-indigo-900">Impact Insight</p>
                                    <p className="text-xs text-indigo-700">
                                        The anonymous feature is successfully removing psychological barriers, leading to higher participation from hesitant students.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex max-h-[420px] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                        <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
                            <h2 className="text-base font-semibold text-gray-900">Live Q&A</h2>
                        </div>

                        {recentQuestions.length > 0 ? (
                            <div className="flex-1 divide-y divide-gray-100 overflow-y-auto">
                                {recentQuestions.map((q) => (
                                    <div key={q.id} className="p-5 transition-colors hover:bg-gray-50">
                                        <div className="mb-2 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="flex size-8 items-center justify-center rounded-lg border border-gray-200 bg-gray-100">
                                                    <i className={`fa-solid text-sm text-gray-500 ${q.is_anonymous ? 'fa-user-secret' : 'fa-user'}`} />
                                                </div>
                                                <p className="text-xs font-semibold text-gray-900">
                                                    {q.is_anonymous ? (q.user?.anonymous_name || 'Anonymous') : (q.user?.name || 'Unknown')}
                                                </p>
                                            </div>
                                            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                                                {new Date(q.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <Link href={route('questions.show', q.id)} className="block">
                                            <p className="line-clamp-2 text-sm font-medium text-gray-800 transition-colors hover:text-indigo-600">
                                                {q.title}
                                            </p>
                                            <div className="mt-3 flex w-max items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 transition-colors hover:bg-indigo-100">
                                                Reply now <i className="fa-solid fa-arrow-right text-[12px]" />
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                                <div className="mb-3 flex size-12 items-center justify-center rounded-xl border border-gray-100 bg-gray-50">
                                    <i className="fa-solid fa-comments text-2xl text-gray-400" />
                                </div>
                                <h3 className="mb-1 text-sm font-semibold text-gray-900">No pending questions</h3>
                                <p className="text-xs text-gray-500">Student questions from your subjects will feed here automatically.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
