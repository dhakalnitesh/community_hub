import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Users, BookOpen, Layers, GraduationCap, TrendingUp, Activity, Plus } from 'lucide-react';

export default function AdminIndex({ stats, institution }) {
    return (
        <AuthenticatedLayout>
            <Head title="Admin Dashboard" />

            <div className="p-8 max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                            {institution ? `${institution.name} Overview` : 'Platform Administration'}
                        </h1>
                        <p className="text-gray-500 mt-2 flex items-center gap-2">
                            <Activity className="text-green-500" size={16} /> System is running smoothly
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link href={route('admin.semesters.create')} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition shadow-sm font-medium flex items-center gap-2">
                            <Plus size={18} /> New Semester
                        </Link>
                        <Link href={route('admin.subjects.create')} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm font-medium flex items-center gap-2">
                            <Plus size={18} /> New Subject
                        </Link>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group hover:border-indigo-200 transition-all">
                        <div className="absolute -right-6 -top-6 bg-blue-50 w-24 h-24 rounded-full group-hover:scale-110 transition-transform"></div>
                        <div className="relative z-10 flex justify-between items-start">
                            <div>
                                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Students</p>
                                <h3 className="text-4xl font-black text-gray-900">{stats.students}</h3>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                                <Users size={24} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm font-medium text-green-600 gap-1">
                            <TrendingUp size={16} />
                            <span>Active this semester</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group hover:border-purple-200 transition-all">
                        <div className="absolute -right-6 -top-6 bg-purple-50 w-24 h-24 rounded-full group-hover:scale-110 transition-transform"></div>
                        <div className="relative z-10 flex justify-between items-start">
                            <div>
                                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Teachers</p>
                                <h3 className="text-4xl font-black text-gray-900">{stats.teachers}</h3>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                                <GraduationCap size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group hover:border-orange-200 transition-all">
                        <div className="absolute -right-6 -top-6 bg-orange-50 w-24 h-24 rounded-full group-hover:scale-110 transition-transform"></div>
                        <div className="relative z-10 flex justify-between items-start">
                            <div>
                                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Semesters</p>
                                <h3 className="text-4xl font-black text-gray-900">{stats.semesters}</h3>
                            </div>
                            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                                <Layers size={24} />
                            </div>
                        </div>
                        <Link href={route('admin.semesters.index')} className="mt-4 inline-flex items-center text-sm font-semibold text-orange-600 hover:text-orange-700">
                            Manage Semesters &rarr;
                        </Link>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group hover:border-teal-200 transition-all">
                        <div className="absolute -right-6 -top-6 bg-teal-50 w-24 h-24 rounded-full group-hover:scale-110 transition-transform"></div>
                        <div className="relative z-10 flex justify-between items-start">
                            <div>
                                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Subjects</p>
                                <h3 className="text-4xl font-black text-gray-900">{stats.subjects}</h3>
                            </div>
                            <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center">
                                <BookOpen size={24} />
                            </div>
                        </div>
                        <Link href={route('admin.subjects.index')} className="mt-4 inline-flex items-center text-sm font-semibold text-teal-600 hover:text-teal-700">
                            Manage Subjects &rarr;
                        </Link>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Activity or Info Panel */}
                    <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Institution Context</h3>
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                            <p className="text-gray-600 leading-relaxed mb-4">
                                This dashboard gives you a high-level overview of the academic structure. Use the quick action buttons to easily configure new semesters and subjects for your students.
                            </p>
                            <div className="flex gap-4">
                                <Link href={route('admin.enrollments.index')} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg shadow-sm hover:border-gray-300 font-medium text-sm transition">
                                    Manage Enrollments
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
