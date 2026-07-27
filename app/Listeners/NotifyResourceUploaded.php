<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;

use App\Enums\NotificationType;
use App\Events\ResourceUploaded;
use App\Services\NotificationService;

class NotifyResourceUploaded implements ShouldQueue
{
    public function __construct(
        protected NotificationService $notificationService,
    ) {}

    public function handle(ResourceUploaded $event): void
    {
        $resource = $event->resource;
        $resource->loadMissing('subject.semester', 'teacher');

        $subject = $resource->subject;
        $semester = $subject->semester;

        // Recipients: all students enrolled in the resource's semester
        $students = $semester->activeStudents;

        $this->notificationService->notifyMany(
            users: $students,
            type: NotificationType::ResourceUploaded,
            title: 'New Resource Uploaded',
            message: "{$resource->teacher->name} uploaded a new resource \"{$resource->title}\" in {$subject->name}.",
            data: [
                'resource_id' => $resource->id,
                'subject_id' => $subject->id,
                'teacher_id' => $resource->teacher_id,
            ],
            link: "/resources",
            excludeUserId: $resource->teacher_id,
        );
    }
}
