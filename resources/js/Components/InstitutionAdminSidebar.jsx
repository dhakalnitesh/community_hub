import { Link, usePage } from '@inertiajs/react';

export default function InstitutionAdminSidebar({ activeItem = '' }) {
    const { url, props } = usePage();
    const user = props.auth?.user;

    const safeRoute = (name, fallback) => {
        try {
            return route(name);
        } catch (e) {
            return fallback;
        }
    };

    const isActive = (path) => url.startsWith(path) || url === path || activeItem === path;

    return (
        <aside className="h-screen w-64 fixed left-0 top-0 bg-surface-container-lowest border-r border-outline-variant flex flex-col py-4 z-50">
            <div className="px-6 mb-8 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-on-primary">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
                </div>
                <div>
                    <h1 className="font-title-md text-title-md font-bold text-primary">EduAdmin Pro</h1>
                    <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Admin Portal</p>
                </div>
            </div>
            <nav className="flex-1 px-2 space-y-1 overflow-y-auto custom-scrollbar">
                <Link
                    href={safeRoute('dashboard', '/dashboard')}
                    className={`flex items-center gap-4 px-4 py-2 transition-colors duration-200 ease-in-out font-body-sm text-body-sm ${
                        isActive('/dashboard')
                            ? 'text-primary font-bold border-r-4 border-primary'
                            : 'text-on-surface-variant hover:bg-surface-container-low'
                    }`}
                >
                    <span className="material-symbols-outlined">dashboard</span>
                    Dashboard
                </Link>
                <Link
                    href={safeRoute('admin.institutions', '/admin/institutions')}
                    className={`flex items-center gap-4 px-4 py-2 transition-colors duration-200 ease-in-out font-body-sm text-body-sm ${
                        isActive('/admin/institutions') || activeItem === 'Institution'
                            ? 'text-primary font-bold border-r-4 border-primary'
                            : 'text-on-surface-variant hover:bg-surface-container-low'
                    }`}
                >
                    <span className="material-symbols-outlined">domain</span>
                    Institution
                </Link>
                <Link
                    href="#"
                    className="flex items-center gap-4 px-4 py-2 text-on-surface-variant hover:bg-surface-container-low transition-colors duration-200 ease-in-out font-body-sm text-body-sm"
                >
                    <span className="material-symbols-outlined">school</span>
                    Teachers
                </Link>
                <Link
                    href="#"
                    className="flex items-center gap-4 px-4 py-2 text-on-surface-variant hover:bg-surface-container-low transition-colors duration-200 ease-in-out font-body-sm text-body-sm"
                >
                    <span className="material-symbols-outlined">group</span>
                    Students
                </Link>
                <Link
                    href="#"
                    className="flex items-center gap-4 px-4 py-2 text-on-surface-variant hover:bg-surface-container-low transition-colors duration-200 ease-in-out font-body-sm text-body-sm"
                >
                    <span className="material-symbols-outlined">event_repeat</span>
                    Semesters
                </Link>
                <Link
                    href="#"
                    className="flex items-center gap-4 px-4 py-2 text-on-surface-variant hover:bg-surface-container-low transition-colors duration-200 ease-in-out font-body-sm text-body-sm"
                >
                    <span className="material-symbols-outlined">book</span>
                    Subjects
                </Link>
                <Link
                    href={safeRoute('assignments.index', '/assignments')}
                    className={`flex items-center gap-4 px-4 py-2 transition-colors duration-200 ease-in-out font-body-sm text-body-sm ${
                        isActive('/assignments')
                            ? 'text-primary font-bold border-r-4 border-primary'
                            : 'text-on-surface-variant hover:bg-surface-container-low'
                    }`}
                >
                    <span className="material-symbols-outlined">assignment</span>
                    Assignments
                </Link>
                <Link
                    href={safeRoute('resources.index', '/resources')}
                    className={`flex items-center gap-4 px-4 py-2 transition-colors duration-200 ease-in-out font-body-sm text-body-sm ${
                        isActive('/resources')
                            ? 'text-primary font-bold border-r-4 border-primary'
                            : 'text-on-surface-variant hover:bg-surface-container-low'
                    }`}
                >
                    <span className="material-symbols-outlined">folder_open</span>
                    Resources
                </Link>
                <Link
                    href={safeRoute('admin.grievances.index', '/admin/grievances')}
                    className={`flex items-center gap-4 px-4 py-2 transition-colors duration-200 ease-in-out font-body-sm text-body-sm ${
                        isActive('/admin/grievances') || activeItem === 'Grievances'
                            ? 'text-primary font-bold border-r-4 border-primary'
                            : 'text-on-surface-variant hover:bg-surface-container-low'
                    }`}
                >
                    <span className="material-symbols-outlined">report</span>
                    Grievances
                </Link>
                <Link
                    href={safeRoute('admin.moderation', '/admin/moderation')}
                    className={`flex items-center gap-4 px-4 py-2 transition-colors duration-200 ease-in-out font-body-sm text-body-sm ${
                        isActive('/admin/moderation') || activeItem === 'Moderation'
                            ? 'text-primary font-bold border-r-4 border-primary'
                            : 'text-on-surface-variant hover:bg-surface-container-low'
                    }`}
                >
                    <span className="material-symbols-outlined">gavel</span>
                    Moderation
                </Link>
                <Link
                    href={safeRoute('questions.index', '/questions')}
                    className={`flex items-center gap-4 px-4 py-2 transition-colors duration-200 ease-in-out font-body-sm text-body-sm ${
                        isActive('/questions') || activeItem === 'Questions'
                            ? 'text-primary font-bold border-r-4 border-primary'
                            : 'text-on-surface-variant hover:bg-surface-container-low'
                    }`}
                >
                    <span className="material-symbols-outlined">forum</span>
                    Discussions
                </Link>
                <Link
                    href={safeRoute('projects.index', '/talent-showcase')}
                    className={`flex items-center gap-4 px-4 py-2 transition-colors duration-200 ease-in-out font-body-sm text-body-sm ${
                        isActive('/talent-showcase') || activeItem === 'Talent Showcase'
                            ? 'text-primary font-bold border-r-4 border-primary'
                            : 'text-on-surface-variant hover:bg-surface-container-low'
                    }`}
                >
                    <span className="material-symbols-outlined">emoji_events</span>
                    Talent Showcase
                </Link>
                <Link
                    href={safeRoute('mentorship.index', '/mentor-board')}
                    className={`flex items-center gap-4 px-4 py-2 transition-colors duration-200 ease-in-out font-body-sm text-body-sm ${
                        isActive('/mentor-board') || activeItem === 'Mentorship'
                            ? 'text-primary font-bold border-r-4 border-primary'
                            : 'text-on-surface-variant hover:bg-surface-container-low'
                    }`}
                >
                    <span className="material-symbols-outlined">handshake</span>
                    Mentorship
                </Link>
                <Link
                    href="#"
                    className="flex items-center gap-4 px-4 py-2 text-on-surface-variant hover:bg-surface-container-low transition-colors duration-200 ease-in-out font-body-sm text-body-sm"
                >
                    <span className="material-symbols-outlined">analytics</span>
                    Analytics
                </Link>
                <Link
                    href="#"
                    className="flex items-center gap-4 px-4 py-2 text-on-surface-variant hover:bg-surface-container-low transition-colors duration-200 ease-in-out font-body-sm text-body-sm"
                >
                    <span className="material-symbols-outlined">calendar_today</span>
                    Calendar
                </Link>
                <Link
                    href={safeRoute('announcements.index', '/announcements')}
                    className={`flex items-center gap-4 px-4 py-2 transition-colors duration-200 ease-in-out font-body-sm text-body-sm ${
                        isActive('/announcements') || activeItem === 'Announcements'
                            ? 'text-primary font-bold border-r-4 border-primary'
                            : 'text-on-surface-variant hover:bg-surface-container-low'
                    }`}
                >
                    <span className="material-symbols-outlined">campaign</span>
                    Announcements
                </Link>
                
                <div className="pt-8 mt-8 border-t border-outline-variant">
                    <Link
                        href={safeRoute('profile.edit', '/profile')}
                        className="flex items-center gap-4 px-4 py-2 text-on-surface-variant hover:bg-surface-container-low transition-colors duration-200 ease-in-out font-body-sm text-body-sm"
                    >
                        <span className="material-symbols-outlined">settings</span>
                        Settings
                    </Link>
                </div>
            </nav>
        </aside>
    );
}
