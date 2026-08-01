import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Welcome({ auth, canLogin, canRegister, laravelVersion, phpVersion, stats }) {
    const [activeTab, setActiveTab] = useState('students');

    const defaultStats = {
        questions: stats?.questions ?? 120,
        answers: stats?.answers ?? 340,
        projects: stats?.projects ?? 45,
        subjects: stats?.subjects ?? 18,
    };

    return (
        <>
            <Head title="GMC Backbenchers - Academic & Student Innovation Platform" />

            <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden">
                <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none" />
                <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] hidden pointer-events-none" />
                <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] hidden pointer-events-none" />

                <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800 transition-all">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                        {/* Brand Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="size-11 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/25 group-hover:scale-105 transition-transform duration-300">
                                <i className="fa-solid fa-graduation-cap text-white"></i>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
                                    GMC <span className="text-indigo-400">Backbenchers</span>
                                </span>
                                <span className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">Academic Community</span>
                            </div>
                        </Link>

                        {/* Navigation Links */}
                        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
                            <a href="#features" className="hover:text-white transition-colors">Features</a>
                            <a href="#community" className="hover:text-white transition-colors">Community</a>
                            <a href="#showcase" className="hover:text-white transition-colors">Talent Hub</a>
                            <a href="#stats" className="hover:text-white transition-colors">Metrics</a>
                        </nav>

                        {/* Auth Buttons */}
                        <div className="flex items-center gap-3">
                            {auth?.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/30"
                                >
                                    <span>Dashboard</span>
                                    <i className="fa-solid fa-arrow-right"></i>
                                </Link>
                            ) : (
                                <>
                                    {canLogin && (
                                        <Link
                                            href={route('login')}
                                            className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 font-medium text-sm transition-all"
                                        >
                                            Log in
                                        </Link>
                                    )}
                                    {canRegister && (
                                        <Link
                                            href={route('register')}
                                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/30"
                                        >
                                            <span>Get Started</span>
                                            <i className="fa-solid fa-wand-magic-sparkles text-emerald-400"></i>
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto">
                        {/* Pill Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-8 shadow-inner">
                            <i className="fa-solid fa-wand-magic-sparkles text-indigo-400 animate-pulse"></i>
                            <span className="tracking-wider font-[14px] text-slate-200">Empowering College Scholars & Innovators</span>
                        </div>

                        {/* Main Title */}
                        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
                            Where <span className="text-indigo-400">Backbenchers</span> Turn Ideas Into Breakthroughs.
                        </h1>

                        {/* Subtitle */}
                        <p className="mt-6 text-lg sm:text-xl text-slate-400 leading-relaxed font-normal max-w-3xl mx-auto">
                            The ultimate collaborative academic platform for students, faculty, and mentors. Solve complex course questions, discover peer mentors, exhibit engineering projects, and streamline your study workflows.
                        </p>

                        {/* CTAs */}
                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                            {auth?.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-indigo-600 text-white font-bold text-base hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/30"
                                >
                                    <span>Enter Your Dashboard</span>
                                    <i className="fa-solid fa-arrow-right"></i>
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('register')}
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-indigo-600 text-white font-bold text-base hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/30"
                                    >
                                        <span>Join the Community</span>
                                        <i className="fa-solid fa-wand-magic-sparkles"></i>
                                    </Link>
                                    <Link
                                        href={route('login')}
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-white hover:bg-slate-800 font-bold text-base transition-all"
                                    >
                                        <span>Sign In</span>
                                        <i className="fa-solid fa-chevron-right text-slate-500"></i>
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Feature Badges */}
                        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500 font-medium">
                            <div className="flex items-center gap-2">
                                <i className="fa-solid fa-circle-check text-emerald-500"></i>
                                <span>Anonymous & Public Q&A</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <i className="fa-solid fa-circle-check text-emerald-500"></i>
                                <span>Verified Peer Mentors</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <i className="fa-solid fa-circle-check text-emerald-500"></i>
                                <span>Student Talent Showcase</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Live Stats Bar */}
                <section id="stats" className="border-y border-slate-800 bg-slate-900">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                                <div className="text-3xl sm:text-4xl font-extrabold text-indigo-400">
                                    {defaultStats.questions}+
                                </div>
                                <div className="mt-1 text-sm font-medium text-slate-500 flex items-center justify-center gap-1.5">
                                    <i className="fa-regular fa-message text-indigo-400"></i>
                                    <span>Questions Asked</span>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                                <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400">
                                    {defaultStats.answers}+
                                </div>
                                <div className="mt-1 text-sm font-medium text-slate-500 flex items-center justify-center gap-1.5">
                                    <i className="fa-solid fa-bolt text-emerald-400"></i>
                                    <span>Solutions Provided</span>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                                <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">
                                    {defaultStats.projects}+
                                </div>
                                <div className="mt-1 text-sm font-medium text-slate-500 flex items-center justify-center gap-1.5">
                                    <i className="fa-solid fa-code text-amber-400"></i>
                                    <span>Student Projects</span>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                                <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400">
                                    {defaultStats.subjects}+
                                </div>
                                <div className="mt-1 text-sm font-medium text-slate-500 flex items-center justify-center gap-1.5">
                                    <i className="fa-solid fa-book-open text-emerald-400"></i>
                                    <span>Active Subjects</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Core Features Grid */}
                <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Platform Features</h2>
                        <p className="mt-3 text-3xl sm:text-4xl font-extrabold text-white">Everything You Need to Excel & Innovate</p>
                        <p className="mt-4 text-slate-500">Designed specifically for academic collaboration, peer mentorship, and engineering showcase.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Card 1 */}
                        <div className="group p-8 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col justify-between">
                            <div>
                                <div className="size-14 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all">
                                    <i className="fa-regular fa-message text-2xl"></i>
                                </div>
                                <h3 className="mt-6 text-xl font-bold text-white">Discussion Q&A Forum</h3>
                                <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                                    Post course doubts anonymously or publicly. Receive community upvotes and accepted answer badges from subject experts.
                                </p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center text-xs font-semibold text-indigo-400 group-hover:translate-x-1 transition-transform">
                                <span>Explore Q&A</span>
                                <i className="fa-solid fa-arrow-right ml-1"></i>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="group p-8 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 flex flex-col justify-between">
                            <div>
                                <div className="size-14 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
                                    <i className="fa-solid fa-users text-2xl"></i>
                                </div>
                                <h3 className="mt-6 text-xl font-bold text-white">Peer & Faculty Mentorship</h3>
                                <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                                    Connect directly with high-performing seniors and professors for personalized guidance, project reviews, and exam tips.
                                </p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
                                <span>Find Mentors</span>
                                <i className="fa-solid fa-arrow-right ml-1"></i>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="group p-8 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col justify-between" id="showcase">
                            <div>
                                <div className="size-14 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-500/20 transition-all">
                                    <i className="fa-solid fa-award text-2xl"></i>
                                </div>
                                <h3 className="mt-6 text-xl font-bold text-white">Talent & Project Showcase</h3>
                                <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                                    Publish your software projects, repositories, and research. Gain recognition from peers and build a standout portfolio.
                                </p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition-transform">
                                <span>View Showcase</span>
                                <i className="fa-solid fa-arrow-right ml-1"></i>
                            </div>
                        </div>

                        {/* Card 4 */}
                        <div className="group p-8 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 flex flex-col justify-between">
                            <div>
                                <div className="size-14 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
                                    <i className="fa-solid fa-book-open text-2xl"></i>
                                </div>
                                <h3 className="mt-6 text-xl font-bold text-white">Resource & Notice Hub</h3>
                                <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                                    Access semester notes, assignment deadlines, curated solution files, and instant institution broadcast announcements.
                                </p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
                                <span>Browse Hub</span>
                                <i className="fa-solid fa-arrow-right ml-1"></i>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Role Tabs Section */}
                <section id="community" className="py-20 bg-slate-900 border-t border-slate-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-12">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Tailored Ecosystem</h2>
                            <p className="mt-3 text-3xl sm:text-4xl font-extrabold text-white">Built for Every Academic Role</p>
                        </div>

                        {/* Tab Buttons */}
                        <div className="flex justify-center gap-3 mb-12">
                            <button
                                onClick={() => setActiveTab('students')}
                                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                                    activeTab === 'students'
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                                        : 'bg-slate-800/60 border border-slate-700 text-slate-400 hover:text-white'
                                }`}
                            >
                                For Students
                            </button>
                            <button
                                onClick={() => setActiveTab('teachers')}
                                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                                    activeTab === 'teachers'
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                                        : 'bg-slate-800/60 border border-slate-700 text-slate-400 hover:text-white'
                                }`}
                            >
                                For Teachers & Mentors
                            </button>
                            <button
                                onClick={() => setActiveTab('admins')}
                                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                                    activeTab === 'admins'
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                                        : 'bg-slate-800/60 border border-slate-700 text-slate-400 hover:text-white'
                                }`}
                            >
                                For Institution Admins
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="max-w-4xl mx-auto rounded-xl bg-slate-950 border border-slate-800 p-8 sm:p-12 shadow-2xl">
                            {activeTab === 'students' && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 text-indigo-400 font-bold text-xl">
                                        <i className="fa-solid fa-graduation-cap"></i>
                                        <span>Empowering Student Journeys</span>
                                    </div>
                                    <p className="text-slate-400 leading-relaxed">
                                        Whether you are struggling with a tricky algorithm assignment or looking for peers to collaborate on a hackathon project, GMC Backbenchers gives you the tools to succeed.
                                    </p>
                                    <div className="grid sm:grid-cols-2 gap-4 pt-4">
                                        <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
                                            <i className="fa-solid fa-check text-indigo-400 shrink-0 mt-0.5"></i>
                                            <span className="text-sm text-slate-400">Ask questions anonymously without fear of judgment</span>
                                        </div>
                                        <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
                                            <i className="fa-solid fa-check text-indigo-400 shrink-0 mt-0.5"></i>
                                            <span className="text-sm text-slate-400">Track all your semester assignments & deadlines</span>
                                        </div>
                                        <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
                                            <i className="fa-solid fa-check text-indigo-400 shrink-0 mt-0.5"></i>
                                            <span className="text-sm text-slate-400">Showcase your portfolio to recruiters & peers</span>
                                        </div>
                                        <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
                                            <i className="fa-solid fa-check text-indigo-400 shrink-0 mt-0.5"></i>
                                            <span className="text-sm text-slate-400">Request 1-on-1 mentorship from top-performing seniors</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'teachers' && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 text-emerald-400 font-bold text-xl">
                                        <i className="fa-solid fa-book-open"></i>
                                        <span>Streamlined Teaching & Mentoring</span>
                                    </div>
                                    <p className="text-slate-400 leading-relaxed">
                                        Faculty and mentors can effectively publish subject courseware, evaluate student submissions, provide feedback, and host dedicated mentorship slots.
                                    </p>
                                    <div className="grid sm:grid-cols-2 gap-4 pt-4">
                                        <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
                                            <i className="fa-solid fa-check text-emerald-400 shrink-0 mt-0.5"></i>
                                            <span className="text-sm text-slate-400">Manage subject discussions and mark verified solutions</span>
                                        </div>
                                        <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
                                            <i className="fa-solid fa-check text-emerald-400 shrink-0 mt-0.5"></i>
                                            <span className="text-sm text-slate-400">Grade assignment submissions with custom feedback</span>
                                        </div>
                                        <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
                                            <i className="fa-solid fa-check text-emerald-400 shrink-0 mt-0.5"></i>
                                            <span className="text-sm text-slate-400">Accept and complete mentorship requests seamlessly</span>
                                        </div>
                                        <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
                                            <i className="fa-solid fa-check text-emerald-400 shrink-0 mt-0.5"></i>
                                            <span className="text-sm text-slate-400">Broadcast important announcements to your classes</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'admins' && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 text-emerald-400 font-bold text-xl">
                                        <i className="fa-solid fa-shield-halved"></i>
                                        <span>Institutional Administration</span>
                                    </div>
                                    <p className="text-slate-400 leading-relaxed">
                                        Institution administrators gain full control over semester structures, subject allocations, teacher assignments, and enrollment metrics.
                                    </p>
                                    <div className="grid sm:grid-cols-2 gap-4 pt-4">
                                        <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
                                            <i className="fa-solid fa-check text-emerald-400 shrink-0 mt-0.5"></i>
                                            <span className="text-sm text-slate-400">Manage institution semesters and subject curricula</span>
                                        </div>
                                        <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
                                            <i className="fa-solid fa-check text-emerald-400 shrink-0 mt-0.5"></i>
                                            <span className="text-sm text-slate-400">Assign faculty teachers to specific subjects</span>
                                        </div>
                                        <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
                                            <i className="fa-solid fa-check text-emerald-400 shrink-0 mt-0.5"></i>
                                            <span className="text-sm text-slate-400">Monitor student enrollment and academic metrics</span>
                                        </div>
                                        <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
                                            <i className="fa-solid fa-check text-emerald-400 shrink-0 mt-0.5"></i>
                                            <span className="text-sm text-slate-400">Ensure security, compliance, and user roles</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Final Call To Action Banner */}
                <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative rounded-xl overflow-hidden bg-indigo-600/10 p-10 sm:p-16 text-center border border-indigo-500/30 shadow-2xl">
                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
                                Ready to Upgrade Your Academic Experience?
                            </h2>
                            <p className="mt-6 text-indigo-200 text-lg">
                                Join hundreds of students, educators, and mentors already using GMC Backbenchers to learn, collaborate, and innovate together.
                            </p>
                            <div className="mt-10 flex flex-wrap justify-center gap-4">
                                {auth?.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-white text-slate-900 font-extrabold text-base hover:bg-slate-100 transition-all shadow-xl hover:-translate-y-0.5"
                                    >
                                        <span>Go to Dashboard</span>
                                        <i className="fa-solid fa-arrow-right"></i>
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('register')}
                                            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-white text-slate-900 font-extrabold text-base hover:bg-slate-100 transition-all shadow-xl hover:-translate-y-0.5"
                                        >
                                            <span>Create Free Account</span>
                                            <i className="fa-solid fa-wand-magic-sparkles text-indigo-600"></i>
                                        </Link>
                                        <Link
                                            href={route('login')}
                                            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-indigo-600/20 border border-indigo-400/40 text-white font-bold text-base hover:bg-indigo-600/30 transition-all"
                                        >
                                            <span>Sign In</span>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-slate-800 bg-slate-950 py-12 text-slate-500 text-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <div className="size-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                                <i className="fa-solid fa-graduation-cap text-white"></i>
                            </div>
                            <span className="font-bold text-slate-200 tracking-tight">GMC Backbenchers</span>
                        </div>

                        <div className="flex items-center gap-6 text-xs font-medium text-slate-500">
                            <span>Laravel v{laravelVersion}</span>
                            <span>•</span>
                            <span>PHP v{phpVersion}</span>
                            <span>•</span>
                            <span>Inertia.js + React</span>
                        </div>

                        <p className="text-xs text-slate-600">
                            &copy; {new Date().getFullYear()} GMC Backbenchers. All rights reserved.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
