<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;

use App\Enums\NotificationType;
use App\Events\AssignmentGraded;
use App\Services\NotificationService;

class NotifyAssignmentGraded implements ShouldQueue
{
    public function __construct(
        protected NotificationService $notificationService,
    ) {}

    public function handle(AssignmentGraded $event): void
    {
        $submission = $event->submission;
        $submission->loadMissing('assignment.subject', 'student');

        $assignment = $submission->assignment;
        $student = $submission->student;

        $this->notificationService->notify(
            user: $student,
            type: NotificationType::AssignmentGraded,
            title: 'Assignment Graded',
            message: "Your submission for \"{$assignment->title}\" has been graded: {$submission->score}/{$assignment->max_score}.",
            data: [
                'assignment_id' => $assignment->id,
                'submission_id' => $submission->id,
                'score' => $submission->score,
                'max_score' => $assignment->max_score,
            ],
            link: "/assignments/submissions/{$submission->id}",
        );
    }
}
