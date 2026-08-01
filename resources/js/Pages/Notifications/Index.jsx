import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationsIndex({ notifications, filters }) {
    const { type, status } = filters;

    const getIcon = (itemType) => {
        if (itemType.startsWith('assignment')) return 'fa-clipboard-list';
        if (itemType.startsWith('question') || itemType.startsWith('answer')) return 'fa-comments';
        if (itemType.startsWith('resource')) return 'fa-folder-open';
        if (itemType.startsWith('announcement')) return 'fa-bullhorn';
        return 'fa-bell';
    };

    const getIconColor = (itemType) => {
        if (itemType.startsWith('assignment')) return 'bg-indigo-50 text-indigo-600';
        if (itemType.startsWith('question') || itemType.startsWith('answer')) return 'bg-emerald-50 text-emerald-600';
        if (itemType.startsWith('resource')) return 'bg-sky-50 text-sky-600';
        if (itemType.startsWith('announcement')) return 'bg-red-50 text-red-600';
        return 'bg-gray-100 text-gray-500';
    };

    const handleFilter = (filterType, filterValue) => {
        const query = { ...filters };

        if (filterValue) {
            query[filterType] = filterValue;
        } else {
            delete query[filterType];
        }

        router.get(route('notifications.index'), query, { preserveState: true });
    };

    const handleMarkAsRead = async (id, e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await axios.post(route('notifications.mark_read', id));
            router.reload({ only: ['notifications', 'auth'] });
        } catch (error) {
            console.error('Failed to mark as read', error);
        }
    };

    return (
        <AuthenticatedLayout header="Notifications">
            <Head title="Notifications" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Notification Center</h1>
                        <p className="text-sm text-gray-500 mt-1">Stay updated with your latest academic activities.</p>
                    </div>

                    <Link
                        href={route('notifications.read_all')}
                        method="post"
                        as="button"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                    >
                        <i className="fa-solid fa-check-double text-xs"></i>
                        Mark all as read
                    </Link>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex flex-wrap gap-4 items-center">
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => handleFilter('status', null)}
                            className={`px-4 py-1.5 rounded-md text-sm transition-colors ${!status ? 'bg-white shadow-sm text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => handleFilter('status', 'unread')}
                            className={`px-4 py-1.5 rounded-md text-sm transition-colors ${status === 'unread' ? 'bg-white shadow-sm text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Unread
                        </button>
                    </div>

                    <div className="h-6 w-px bg-gray-200"></div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => handleFilter('type', null)}
                            className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${!type ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                        >
                            All Types
                        </button>
                        <button
                            onClick={() => handleFilter('type', 'assignment.created')}
                            className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${type === 'assignment.created' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                        >
                            Assignments
                        </button>
                        <button
                            onClick={() => handleFilter('type', 'question.posted')}
                            className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${type === 'question.posted' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                        >
                            Discussions
                        </button>
                        <button
                            onClick={() => handleFilter('type', 'resource.uploaded')}
                            className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${type === 'resource.uploaded' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                        >
                            Resources
                        </button>
                        <button
                            onClick={() => handleFilter('type', 'announcement.published')}
                            className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${type === 'announcement.published' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                        >
                            Announcements
                        </button>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    {notifications.data.length === 0 ? (
                        <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                                <i className="fa-solid fa-bell-slash text-3xl"></i>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">No notifications found</h3>
                            <p className="text-sm">You're completely caught up. Check back later for updates.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {notifications.data.map((notification) => (
                                <Link
                                    key={notification.id}
                                    href={notification.link || '#'}
                                    onClick={async (e) => {
                                        if (!notification.read_at) {
                                            await handleMarkAsRead(notification.id, e);
                                        }
                                    }}
                                    className={`flex p-5 gap-4 hover:bg-gray-50 transition-colors ${!notification.read_at ? 'bg-indigo-50/40' : ''}`}
                                >
                                    <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-lg ${getIconColor(notification.type)}`}>
                                        <i className={`fa-solid ${getIcon(notification.type)}`}></i>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1 gap-4">
                                            <h4 className={`font-semibold ${!notification.read_at ? 'text-gray-900' : 'text-gray-500'}`}>
                                                {notification.title}
                                            </h4>
                                            <span className="shrink-0 text-xs text-gray-400">
                                                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                            </span>
                                        </div>
                                        <p className={`text-sm leading-relaxed ${!notification.read_at ? 'text-gray-600' : 'text-gray-400'}`}>
                                            {notification.message}
                                        </p>
                                    </div>
                                    {!notification.read_at && (
                                        <div className="shrink-0 self-center ml-2">
                                            <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full ring-4 ring-indigo-100"></div>
                                        </div>
                                    )}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {notifications.last_page > 1 && (
                    <div className="mt-6 flex justify-center gap-1">
                        {notifications.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                                    link.active
                                        ? 'bg-indigo-600 text-white'
                                        : !link.url
                                          ? 'text-gray-300 pointer-events-none'
                                          : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
