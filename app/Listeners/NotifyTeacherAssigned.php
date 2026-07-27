<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;

use App\Enums\NotificationType;
use App\Events\TeacherAssigned;
use App\Services\NotificationService;

class NotifyTeacherAssigned implements ShouldQueue
{
    public function __construct(
        protected NotificationService $notificationService,
    ) {}

    public function handle(TeacherAssigned $event): void
    {
        $subject = $event->subject;
        $teacher = $event->teacher;
        $subject->loadMissing('semester.institution');

        $semester = $subject->semester;

        $this->notificationService->notify(
            user: $teacher,
            type: NotificationType::TeacherAssigned,
            title: 'Assigned to Subject',
            message: "You have been assigned to teach {$subject->name} in {$semester->name}.",
            data: [
                'subject_id' => $subject->id,
                'semester_id' => $semester->id,
            ],
            link: "/dashboard",
        );
    }
}
