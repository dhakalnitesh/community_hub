<?php

namespace App\Http\Controllers\Platform;

use App\Models\Platform\Notification;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Http\Controllers\Controller;

class NotificationController extends Controller
{
    public function __construct(
        protected NotificationService $notificationService,
    ) {}

    public function index(Request $request)
    {
        $type = $request->query('type');
        $readStatus = $request->query('status'); // 'read' or 'unread'
        
        $notifications = $this->notificationService->getNotifications(
            user: Auth::user(),
            type: $type,
            readStatus: $readStatus,
            perPage: 20
        );

        return inertia('Notifications/Index', [
            'notifications' => $notifications,
            'filters' => [
                'type' => $type,
                'status' => $readStatus,
            ],
        ]);
    }

    public function apiIndex(Request $request)
    {
        // For the dropdown bell
        $limit = $request->query('limit', 10);
        $notifications = $this->notificationService->getLatest(Auth::user(), $limit);
        $unreadCount = $this->notificationService->getUnreadCount(Auth::user());

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => $unreadCount,
        ]);
    }

    public function markAsRead(Notification $notification)
    {
        if ($notification->user_id !== Auth::id()) {
            abort(403);
        }

        $this->notificationService->markAsRead($notification);

        return response()->json(['success' => true]);
    }

    public function markAllAsRead()
    {
        $this->notificationService->markAllAsRead(Auth::user());

        return redirect()->back();
    }
}
