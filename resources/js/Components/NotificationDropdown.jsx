import { Link } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationDropdown({ notifications, onClose }) {
    const getIcon = (type) => {
        if (type.startsWith('assignment')) return 'fa-clipboard-list';
        if (type.startsWith('question') || type.startsWith('answer')) return 'fa-comments';
        if (type.startsWith('resource')) return 'fa-folder-open';
        if (type.startsWith('announcement')) return 'fa-bullhorn';
        return 'fa-bell';
    };

    const getIconColor = (type) => {
        if (type.startsWith('assignment')) return 'text-indigo-600 bg-indigo-50';
        if (type.startsWith('question') || type.startsWith('answer')) return 'text-emerald-600 bg-emerald-50';
        if (type.startsWith('resource')) return 'text-blue-600 bg-blue-50';
        if (type.startsWith('announcement')) return 'text-red-600 bg-red-50';
        return 'text-gray-600 bg-gray-100';
    };

    const handleMarkAsRead = async (id, e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await axios.post(route('notifications.mark_read', id));
        } catch (error) {
            console.error('Failed to mark as read', error);
        }
    };

    return (
        <div className="flex max-h-[80vh] w-80 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg sm:w-96">
            <div className="flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3">
                <h3 className="font-bold text-gray-900">Notifications</h3>
                <Link
                    href={route('notifications.read_all')}
                    method="post"
                    as="button"
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                    onClick={onClose}
                >
                    Mark all read
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto">
                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center px-4 py-10 text-gray-500">
                        <i className="fa-solid fa-bell-slash mb-3 text-4xl opacity-40" />
                        <p className="text-sm">You're all caught up!</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {notifications.map((notification) => (
                            <Link
                                key={notification.id}
                                href={notification.link || '#'}
                                onClick={async (e) => {
                                    if (!notification.read_at) {
                                        await handleMarkAsRead(notification.id, e);
                                    }
                                    onClose();
                                }}
                                className={`block p-4 transition-colors hover:bg-gray-50 ${
                                    !notification.read_at ? 'bg-indigo-50/40' : ''
                                }`}
                            >
                                <div className="flex gap-3">
                                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${getIconColor(notification.type)}`}>
                                        <i className={`fa-solid ${getIcon(notification.type)} text-[16px]`} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="mb-0.5 flex items-start justify-between gap-2">
                                            <p className={`truncate text-sm font-semibold ${!notification.read_at ? 'text-gray-900' : 'text-gray-600'}`}>
                                                {notification.title}
                                            </p>
                                            <span className="shrink-0 text-xs text-gray-400">
                                                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                            </span>
                                        </div>
                                        <p className={`line-clamp-2 text-sm ${!notification.read_at ? 'text-gray-600' : 'text-gray-400'}`}>
                                            {notification.message}
                                        </p>
                                    </div>
                                    {!notification.read_at && (
                                        <div className="ml-1 h-2 w-2 shrink-0 self-center rounded-full bg-indigo-600" />
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <div className="border-t border-gray-100 bg-gray-50 p-2 text-center">
                <Link
                    href={route('notifications.index')}
                    onClick={onClose}
                    className="block w-full rounded-lg py-2 text-sm font-semibold text-indigo-600 transition-colors hover:bg-gray-100"
                >
                    View All Notifications
                </Link>
            </div>
        </div>
    );
}
