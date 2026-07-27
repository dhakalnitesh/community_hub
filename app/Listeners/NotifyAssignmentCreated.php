<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;

use App\Enums\NotificationType;
use App\Events\AssignmentCreated;
use App\Services\NotificationService;

class NotifyAssignmentCreated implements ShouldQueue
{
    public function __construct(
        protected NotificationService $notificationService,
    ) {}

    public function handle(AssignmentCreated $event): void
    {
        $assignment = $event->assignment;
        $assignment->loadMissing('subject.semester', 'teacher');

        $subject = $assignment->subject;
        $semester = $subject->semester;

        // Recipients: all students enrolled in the assignment's semester
        $students = $semester->activeStudents;

        $this->notificationService->notifyMany(
            users: $students,
            type: NotificationType::AssignmentCreated,
            title: 'New Assignment',
            message: "{$assignment->title} has been published in {$subject->name}.",
            data: [
                'assignment_id' => $assignment->id,
                'subject_id' => $subject->id,
                'teacher_id' => $assignment->teacher_id,
            ],
            link: "/assignments/{$assignment->id}",
            excludeUserId: $assignment->teacher_id,
        );
    }
}
