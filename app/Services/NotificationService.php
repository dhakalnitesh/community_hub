<?php

namespace App\Services;

use App\Enums\NotificationType;
use App\Models\Platform\Notification;
use App\Models\Core\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class NotificationService
{
    /**
     * Send a notification to a single user.
     */
    public function notify(
        User $user,
        NotificationType $type,
        string $title,
        string $message,
        array $data = [],
        ?string $link = null,
    ): Notification {
        return Notification::create([
            'user_id' => $user->id,
            'type' => $type->value,
            'title' => $title,
            'message' => $message,
            'data' => $data,
            'link' => $link,
        ]);
    }

    /**
     * Send a notification to many users via bulk insert.
     * Avoids N individual queries.
     */
    public function notifyMany(
        Collection|\Illuminate\Support\Collection $users,
        NotificationType $type,
        string $title,
        string $message,
        array $data = [],
        ?string $link = null,
        ?int $excludeUserId = null,
    ): void {
        $now = now();
        $rows = [];

        foreach ($users as $user) {
            // Skip the actor if provided (don't self-notify)
            if ($excludeUserId !== null && $user->id === $excludeUserId) {
                continue;
            }

            $rows[] = [
                'user_id' => $user->id,
                'type' => $type->value,
                'title' => $title,
                'message' => $message,
                'data' => json_encode($data),
                'link' => $link,
                'read_at' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        if (!empty($rows)) {
            // Insert in chunks of 500 to avoid hitting SQLite limits
            foreach (array_chunk($rows, 500) as $chunk) {
                Notification::insert($chunk);
            }
        }
    }

    /**
     * Mark a single notification as read.
     */
    public function markAsRead(Notification $notification): void
    {
        $notification->markAsRead();
    }

    /**
     * Mark all notifications as read for a user.
     */
    public function markAllAsRead(User $user): void
    {
        $user->notifications()->unread()->update(['read_at' => now()]);
    }

    /**
     * Get the unread notification count for a user.
     */
    public function getUnreadCount(User $user): int
    {
        return $user->notifications()->unread()->count();
    }

    /**
     * Get paginated notifications for a user, optionally filtered by type.
     */
    public function getNotifications(
        User $user,
        ?string $type = null,
        ?string $readStatus = null,
        int $perPage = 20,
    ): LengthAwarePaginator {
        $query = $user->notifications()->latest();

        if ($type !== null) {
            $query->ofType($type);
        }

        if ($readStatus === 'unread') {
            $query->unread();
        } elseif ($readStatus === 'read') {
            $query->read();
        }

        return $query->paginate($perPage);
    }

    /**
     * Get the latest notifications for dropdown display.
     */
    public function getLatest(User $user, int $limit = 10): \Illuminate\Database\Eloquent\Collection
    {
        return $user->notifications()->latest()->limit($limit)->get();
    }
}
