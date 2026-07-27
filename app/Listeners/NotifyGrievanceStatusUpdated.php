<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;

use App\Enums\NotificationType;
use App\Events\GrievanceStatusUpdated;
use App\Services\NotificationService;

class NotifyGrievanceStatusUpdated implements ShouldQueue
{
    public function __construct(
        protected NotificationService $notificationService,
    ) {}

    public function handle(GrievanceStatusUpdated $event): void
    {
        $grievance = $event->grievance;
        $statusLabels = ['received' => 'Received', 'in_progress' => 'In Progress', 'resolved' => 'Resolved'];

        $title = "Grievance Status Updated";
        $oldLabel = $statusLabels[$event->oldStatus] ?? $event->oldStatus;
        $newLabel = $statusLabels[$event->newStatus] ?? $event->newStatus;
        $message = "Grievance #{$grievance->reference_code}: $oldLabel -> $newLabel";
        $link = $grievance->user_id
            ? route('grievances.show-reference', $grievance->reference_code)
            : route('admin.grievances.show', $grievance->id);

        if ($grievance->user_id) {
            $this->notificationService->notify(
                user: $grievance->submitter,
                type: NotificationType::GrievanceStatusUpdated,
                title: $title,
                message: $message,
                data: ['grievance_id' => $grievance->id, 'new_status' => $event->newStatus],
                link: $link,
            );
        }

        if ($grievance->assigned_to && $grievance->assigned_to !== $grievance->user_id) {
            $this->notificationService->notify(
                user: $grievance->assignedUser,
                type: NotificationType::GrievanceStatusUpdated,
                title: $title,
                message: $message,
                data: ['grievance_id' => $grievance->id, 'new_status' => $event->newStatus],
                link: route('admin.grievances.show', $grievance->id),
            );
        }
    }
}