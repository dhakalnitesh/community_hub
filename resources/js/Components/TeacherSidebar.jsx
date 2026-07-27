import { Link, usePage } from '@inertiajs/react';
import React from 'react';

export default function TeacherSidebar() {
    const { url } = usePage();
    const user = usePage().props.auth.user;

    const isActive = (path) => {
        if (path === '/dashboard' && url === '/') return true;
        return url.startsWith(path);
    };

    const navGroups = [
        {
            title: 'Overview',
            links: [
                { name: 'Dashboard', path: '/dashboard', icon: 'space_dashboard' },
                { name: 'My Classes', path: '/classes', icon: 'library_books' },
            ]
        },
        {
            title: 'Instruction',
            links: [
                { name: 'Assignments', path: '/assignments', icon: 'assignment' },
                { name: 'Resources', path: '/resources', icon: 'folder_open' },
            ]
        },
        {
            title: 'Communication',
            links: [
                { name: 'Anonymous Q&A', path: '/questions', icon: 'forum', badge: 'New' },
                { name: 'Grievances', path: '/grievances/feed', icon: 'report_problem' },
            ]
        },
        {
            title: 'Community',
            links: [
                { name: 'Talent Showcase', path: '/talent-showcase', route: 'projects.index', icon: 'emoji_events' },
                { name: 'Mentorship', path: '/mentor-board', route: 'mentorship.index', icon: 'handshake' },
            ]
        }
    ];

    return (
        <aside className="w-[260px] flex-shrink-0 border-r border-gray-200 bg-white flex flex-col h-screen fixed left-0 top-0 z-40 transition-all duration-300">
            {/* Header / Logo */}
            <div className="h-16 flex items-center px-6 border-b border-gray-100 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-sm">
                        <span className="material-symbols-outlined text-[18px]">school</span>
                    </div>
                    <div>
                        <h1 className="text-[15px] font-bold text-gray-900 leading-tight tracking-tight">Academic Nexus</h1>
                        <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest">Teacher Panel</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto px-4 sidebar-scroll">
                {navGroups.map((group, index) => (
                    <div key={index} className="mb-6">
                        <h3 className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                            {group.title}
                        </h3>
                        <ul className="space-y-1">
                            {group.links.map((link) => {
                                const active = isActive(link.path);
                                return (
                                    <li key={link.name}>
                                        <Link
                                            href={link.route ? route(link.route) : (link.path !== '/classes' ? route(link.path.replace('/feed', '').replace('/', '') + (link.path === '/dashboard' ? '' : link.path === '/grievances/feed' ? '.feed' : '.index')) : route('classes.index'))}
                                            className={`group flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                                active 
                                                ? 'bg-indigo-50 text-indigo-700' 
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className={`material-symbols-outlined text-[20px] transition-colors ${
                                                    active ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'
                                                }`}>
                                                    {link.icon}
                                                </span>
                                                {link.name}
                                            </div>
                                            {link.badge && (
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                                    active ? 'bg-indigo-200 text-indigo-800' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                    {link.badge}
                                                </span>
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Bottom Account Section */}
            <div className="p-4 mt-auto border-t border-gray-100">
                <Link href={route('profile.edit')} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
                        {user.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <span className="material-symbols-outlined text-gray-400 group-hover:text-gray-600 text-[18px]">more_vert</span>
                </Link>
            </div>
        </aside>
    );
}
