import { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import NotificationBell from '@/Components/NotificationBell';

const safeRoute = (name, fallback) => {
    try {
        return route(name);
    } catch (e) {
        return fallback;
    }
};

export default function Navbar({ collapsed = false, mobileOpen = false, onToggleSidebar = () => {} }) {
    const user = usePage().props.auth?.user;
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = () => {
        router.post(route('logout'), {}, {
            onFinish: () => {
                window.location.href = '/';
            },
        });
    };

    const roleLabel = user?.role ? user.role.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'Member';

    return (
        <nav className="fixed left-0 right-0 top-0 z-50 flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-3 text-gray-900">
            {/* Left */}
            <div className="flex items-center gap-1">
                <button
                    type="button"
                    onClick={onToggleSidebar}
                    className="flex size-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200 lg:hidden"
                    title={mobileOpen ? 'Close menu' : 'Open menu'}
                >
                    <i className={`fa-solid ${mobileOpen ? 'fa-xmark' : 'fa-bars'}`} />
                </button>

                <button
                    type="button"
                    onClick={onToggleSidebar}
                    className="hidden size-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200 lg:flex"
                    title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    <i className={`fa-solid ${collapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`} />
                </button>

                <div className="hidden items-center gap-1 md:flex">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
                        <i className="fa-solid fa-school" />
                    </div>
                    <div className="ml-2 leading-tight">
                        <h2 className="text-lg font-bold tracking-tight text-gray-900">EduVoice</h2>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Learning Platform</p>
                    </div>
                </div>
            </div>

            {/* Center search */}
            <div className="hidden flex-1 max-w-xl px-6 lg:block">
                <div className="relative w-full group">
                    <i className="fa-solid fa-magnifying-glass pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-gray-400 group-focus-within:text-indigo-600" />
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        className="block w-full rounded-lg border-none bg-gray-100 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 outline-none transition-all focus:ring-2 focus:ring-indigo-500/50"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => setSearchQuery('')}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                            title="Clear search"
                        >
                            <i className="fa-solid fa-xmark" />
                        </button>
                    )}
                </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
                <div className="hidden items-center gap-2 md:flex">
                    <NotificationBell />
                    <button
                        type="button"
                        className="flex size-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200"
                        title="Help"
                    >
                        <i className="fa-solid fa-circle-question" />
                    </button>
                </div>

                <div className="mx-1 hidden h-8 w-px bg-gray-200 md:block" />

                {/* User menu */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setUserMenuOpen((prev) => !prev)}
                        className="group flex items-center gap-3 focus:outline-none"
                    >
                        <div className="hidden text-right sm:block">
                            <p className="text-sm font-bold leading-none text-gray-900">{user?.name || 'User'}</p>
                            <p className="mt-1 text-xs text-gray-500">{roleLabel}</p>
                        </div>
                        <div className="flex size-10 items-center justify-center rounded-full bg-indigo-600 font-bold uppercase text-white ring-2 ring-indigo-100">
                            {user?.name ? user.name.charAt(0) : 'A'}
                        </div>
                        <i className="fa-solid fa-chevron-down hidden text-xs text-gray-500 md:block" />
                    </button>

                    {userMenuOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                            <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                                <div className="border-b border-gray-100 px-4 py-3">
                                    <div className="font-medium text-gray-900">{user?.name || 'User'}</div>
                                    <div className="truncate text-xs text-gray-500">{user?.email}</div>
                                    <div className="mt-1 text-xs text-gray-400">{roleLabel}</div>
                                </div>
                                <div className="py-1">
                                    <Link
                                        href={safeRoute('profile.edit', '/profile')}
                                        onClick={() => setUserMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        <i className="fa-solid fa-user w-5 text-center text-gray-400" />
                                        Profile
                                    </Link>
                                    <Link
                                        href={safeRoute('notifications.index', '/notifications')}
                                        onClick={() => setUserMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        <i className="fa-solid fa-bell w-5 text-center text-gray-400" />
                                        Notifications
                                    </Link>
                                </div>
                                <div className="border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
                                    >
                                        <i className="fa-solid fa-right-from-bracket w-5 text-center" />
                                        Log out
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
