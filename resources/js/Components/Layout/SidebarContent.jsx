import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

const safeRoute = (name, fallback) => {
    try {
        return route(name);
    } catch (e) {
        return fallback;
    }
};

export default function SidebarContent({
    config = [],
    collapsed = false,
    isMobile = false,
    onClose = () => {},
    onExpand = () => {},
}) {
    const { url, props } = usePage();
    const rawPath = url.split('?')[0];
    const user = props.auth?.user;

    const [openGroups, setOpenGroups] = useState({});

    const isItemActive = (item) => {
        const p = item.pattern;
        if (!p) return false;
        if (item.exact) return rawPath === p || rawPath === p + '/';
        if (rawPath === p) return true;
        return rawPath.startsWith(p.endsWith('/') ? p : p + '/');
    };

    const isItemOrChildActive = (item) => {
        if (isItemActive(item)) return true;
        if (item.children) return item.children.some(isItemActive);
        return false;
    };

    const isGroupOpen = (item) => {
        const explicit = openGroups[item.name];
        if (explicit !== undefined) return explicit;
        return item.children ? item.children.some(isItemActive) : false;
    };

    const toggleGroup = (item) => {
        if (collapsed && !isMobile) {
            onExpand();
            return;
        }
        setOpenGroups((prev) => ({ ...prev, [item.name]: !isGroupOpen(item) }));
    };

    const iconClass = 'w-4 text-center text-[14px] shrink-0';

    return (
        <div className="flex h-full flex-col">
            {/* Mobile close button */}
            {isMobile && (
                <div className="flex items-center justify-between px-4 pt-4 pb-2">
                    <div className="flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                            <i className="fa-solid fa-school text-[15px]" />
                        </div>
                        <span className="text-sm font-bold text-gray-900">EduVoice</span>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex size-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
                        title="Close menu"
                    >
                        <i className="fa-solid fa-xmark" />
                    </button>
                </div>
            )}

            {/* Navigation */}
            <nav className={`flex-1 overflow-y-auto overflow-x-hidden sidebar-scroll ${collapsed && !isMobile ? 'px-2.5 py-4' : 'px-4 py-4'}`}>
                {config.map((section) => (
                    <div key={section.section} className={collapsed && !isMobile ? 'mb-4' : 'mb-6'}>
                        <p
                            className="select-none px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400"
                            title={section.section}
                        >
                            {collapsed && !isMobile ? '···' : section.section}
                        </p>
                        <ul className="space-y-1">
                            {section.items.map((item) =>
                                item.children ? (
                                    <li key={item.name}>
                                        <div
                                            role="button"
                                            tabIndex={0}
                                            onClick={() => toggleGroup(item)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    e.preventDefault();
                                                    toggleGroup(item);
                                                }
                                            }}
                                            title={collapsed ? item.name : undefined}
                                            className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer select-none ${
                                                isItemOrChildActive(item)
                                                    ? 'bg-indigo-50 text-indigo-600'
                                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <i className={`fa-solid ${item.icon} ${iconClass} ${isItemOrChildActive(item) ? 'text-indigo-600' : 'text-gray-400'}`} />
                                                {!collapsed && <span className="truncate">{item.name}</span>}
                                            </div>
                                            {!collapsed && (
                                                <i className={`fa-solid fa-chevron-down text-[10px] text-gray-400 transition-transform duration-200 ${isGroupOpen(item) ? 'rotate-180' : ''}`} />
                                            )}
                                        </div>

                                        {!collapsed && isGroupOpen(item) && (
                                            <ul className="ml-4 mt-1 space-y-0.5 border-l border-gray-100 pl-3">
                                                {item.children.map((child) => {
                                                    const active = isItemActive(child);
                                                    return (
                                                        <li key={child.name}>
                                                            <Link
                                                                href={safeRoute(child.route, child.fallback)}
                                                                onClick={() => isMobile && onClose()}
                                                                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
                                                                    active
                                                                        ? 'bg-indigo-50 font-medium text-indigo-600'
                                                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                                                }`}
                                                            >
                                                                <i className={`fa-solid ${child.icon} ${iconClass} text-[12px] ${active ? 'text-indigo-600' : 'text-gray-400'}`} />
                                                                <span className="truncate">{child.name}</span>
                                                            </Link>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        )}
                                    </li>
                                ) : (
                                    <li key={item.name}>
                                        <Link
                                            href={safeRoute(item.route, item.fallback)}
                                            onClick={() => isMobile && onClose()}
                                            title={collapsed ? item.name : undefined}
                                            className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                                                isItemActive(item)
                                                    ? 'bg-indigo-50 text-indigo-600'
                                                    : 'text-gray-600 hover:translate-x-0.5 hover:bg-gray-50 hover:text-gray-900'
                                            } ${collapsed && !isMobile ? 'justify-center' : ''}`}
                                        >
                                            <i className={`fa-solid ${item.icon} ${iconClass} ${isItemActive(item) ? 'text-indigo-600' : 'text-gray-400'}`} />
                                            {!collapsed && <span className="truncate">{item.name}</span>}
                                            {isItemActive(item) && (
                                                <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-indigo-600" />
                                            )}
                                        </Link>
                                    </li>
                                ),
                            )}
                        </ul>
                    </div>
                ))}
            </nav>

            {/* Bottom: user + logout */}
            <div className={`border-t border-gray-100 ${collapsed && !isMobile ? 'px-2.5 py-3' : 'p-4'}`}>
                <div className="mb-2 flex items-center gap-3 rounded-lg bg-gray-50 p-2">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 font-bold uppercase text-white">
                        {user?.name ? user.name.charAt(0) : 'A'}
                    </div>
                    {!collapsed && (
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
                            <p className="truncate text-xs text-gray-500">{user?.role?.replace('_', ' ') || 'Member'}</p>
                        </div>
                    )}
                </div>
                <Link
                    href={safeRoute('profile.edit', '/profile')}
                    title="Profile"
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-gray-50 hover:text-gray-900 ${
                        collapsed && !isMobile ? 'justify-center' : ''
                    }`}
                >
                    <i className={`fa-solid fa-gear ${iconClass} text-gray-400`} />
                    {!collapsed && <span>Settings</span>}
                </Link>
                <Link
                    href={safeRoute('logout', '/logout')}
                    method="post"
                    as="button"
                    title="Log out"
                    onClick={(e) => {
                        if (!confirm('Do you want to log out?')) e.preventDefault();
                    }}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-all duration-200 hover:bg-red-50 ${
                        collapsed && !isMobile ? 'justify-center' : ''
                    }`}
                >
                    <i className={`fa-solid fa-right-from-bracket ${iconClass} text-red-500`} />
                    {!collapsed && <span>Log out</span>}
                </Link>
            </div>
        </div>
    );
}
