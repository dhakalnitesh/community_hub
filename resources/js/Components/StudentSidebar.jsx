import { Link, usePage } from '@inertiajs/react';

export default function StudentSidebar({ activeItem = '' }) {
    const { url, props } = usePage();
    const { auth } = props;
    const user = auth?.user;

    const navItems = [
        { name: 'Dashboard', icon: 'dashboard', route: 'student.dashboard', fallback: '/student/dashboard', pattern: '/student/dashboard' },
        { name: 'My Subjects', icon: 'auto_stories', route: 'student.subjects', fallback: '/student/mysubject', pattern: '/student/mysubject' },
        { name: 'Discussions', icon: 'forum', route: 'questions.index', fallback: '/questions', pattern: '/questions' },
        { name: 'Talent Showcase', icon: 'emoji_events', route: 'projects.index', fallback: '/talent-showcase', pattern: '/talent-showcase' },
        { name: 'Mentorship', icon: 'handshake', route: 'mentorship.index', fallback: '/mentor-board', pattern: '/mentor-board' },
        { name: 'Assignments', icon: 'assignment', route: 'assignments.index', fallback: '/assignments', pattern: '/assignments' },
        { name: 'Resources', icon: 'folder_open', route: 'resources.index', fallback: '/resources', pattern: '/resources' },
        { name: 'Grievances', icon: 'report', route: 'grievances.create', fallback: '/grievances/submit', pattern: '/grievances' },
        { name: 'Profile', icon: 'account_circle', route: 'profile.edit', fallback: '/profile', pattern: '/profile' },
    ];

    const safeRoute = (name, fallback) => {
        try {
            return route(name);
        } catch (e) {
            return fallback;
        }
    };

    return (
        <aside className="h-screen w-72 fixed left-0 top-0 bg-white/80 dark:bg-inverse-surface/80 backdrop-blur-xl border-r border-surface-container-low shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex flex-col py-6 z-50 transition-all duration-300">
            {/* Header / User Profile */}
            <div className="px-6 pb-6 flex items-center gap-4 border-b border-surface-container-low/50">
                <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: '"FILL" 1' }}>school</span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="overflow-hidden flex-1">
                    <h1 className="font-label-lg text-label-lg font-bold text-on-surface truncate">{user?.name || 'Student Name'}</h1>
                    <p className="text-label-sm text-on-surface-variant truncate">Student Panel</p>
                </div>
            </div>
            
            {/* Navigation */}
            <nav className="flex-1 mt-6 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
                <div className="px-3 mb-2">
                    <p className="text-[10px] font-bold text-outline uppercase tracking-widest">Main Menu</p>
                </div>
                
                {navItems.map((item) => {
                    const isActive = url.startsWith(item.pattern) || activeItem === item.name;
                    return (
                        <Link
                            key={item.name}
                            href={safeRoute(item.route, item.fallback)}
                            className={`flex items-center gap-3 px-4 py-3 group transition-all duration-200 rounded-xl ${
                                isActive
                                    ? 'bg-primary/10 text-primary font-bold shadow-sm'
                                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                            }`}
                        >
                            <span className={`material-symbols-outlined transition-transform duration-200 group-hover:scale-110 group-active:scale-95 ${isActive ? 'text-primary' : ''}`} style={{ fontVariationSettings: isActive ? '"FILL" 1' : '"FILL" 0' }}>{item.icon}</span>
                            <span className="font-label-md text-label-md flex-1">{item.name}</span>
                            {isActive && (
                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                            )}
                        </Link>
                    );
                })}
            </nav>
            
            {/* Footer / Logout */}
            <div className="px-4 pt-4 mt-2 border-t border-surface-container-low/50">
                <Link
                    href={safeRoute('logout', '/logout')}
                    method="post"
                    as="button"
                    onClick={(e) => { if (!confirm('Do you want to logout?')) e.preventDefault(); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-error/10 hover:text-error transition-all duration-200 rounded-xl group"
                >
                    <span className="material-symbols-outlined group-hover:scale-110 transition-transform duration-200 group-active:scale-95">logout</span>
                    <span className="font-label-md text-label-md font-medium">Logout</span>
                </Link>
            </div>
        </aside>
    );
}
