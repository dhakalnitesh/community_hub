<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;

use App\Enums\NotificationType;
use App\Events\GrievanceSubmitted;
use App\Services\NotificationService;

class NotifyGrievanceSubmitted implements ShouldQueue
{
    public function __construct(
        protected NotificationService $notificationService,
    ) {}

    public function handle(GrievanceSubmitted $event): void
    {
        $grievance = $event->grievance;

        if ($grievance->assigned_to) {
            $this->notificationService->notify(
                user: $grievance->assignedUser,
                type: NotificationType::GrievanceAssigned,
                title: 'Grievance Assigned to You',
                message: "You have been assigned grievance #{$grievance->reference_code}: {$grievance->title}",
                data: ['grievance_id' => $grievance->id],
                link: route('admin.grievances.show', $grievance->id),
            );
        }

        $institutionAdmin = $grievance->institution?->admins()->first();
        if ($institutionAdmin) {
            $this->notificationService->notify(
                user: $institutionAdmin,
                type: NotificationType::GrievanceSubmitted,
                title: 'New Grievance Received',
                message: "New grievance #{$grievance->reference_code}: {$grievance->title}",
                data: ['grievance_id' => $grievance->id],
                link: route('admin.grievances.show', $grievance->id),
            );
        }
    }
}