<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;

use App\Enums\NotificationType;
use App\Events\AnnouncementPublished;
use App\Services\NotificationService;

class NotifyAnnouncementPublished implements ShouldQueue
{
    public function __construct(
        protected NotificationService $notificationService,
    ) {}

    public function handle(AnnouncementPublished $event): void
    {
        $announcement = $event->announcement;
        $announcement->loadMissing('subject.semester', 'user');

        $subject = $announcement->subject;
        $semester = $subject->semester;

        // Recipients: all students enrolled in the announcement's semester
        $students = $semester->activeStudents;

        $this->notificationService->notifyMany(
            users: $students,
            type: NotificationType::AnnouncementPublished,
            title: 'New Announcement',
            message: "{$announcement->user->name} posted an announcement in {$subject->name}: {$announcement->title}",
            data: [
                'announcement_id' => $announcement->id,
                'subject_id' => $subject->id,
                'author_id' => $announcement->user_id,
            ],
            link: "/announcements",
            excludeUserId: $announcement->user_id,
        );
    }
}
