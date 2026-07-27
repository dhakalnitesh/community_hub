<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;

use App\Enums\NotificationType;
use App\Events\StudentEnrolled;
use App\Services\NotificationService;

class NotifyStudentEnrolled implements ShouldQueue
{
    public function __construct(
        protected NotificationService $notificationService,
    ) {}

    public function handle(StudentEnrolled $event): void
    {
        $semester = $event->semester;
        $student = $event->student;
        $semester->loadMissing('institution.users');

        $institution = $semester->institution;
        
        // Find all institution admins for this institution
        $admins = $institution->users()->wherePivot('role', 'institution_admin')->get();

        $this->notificationService->notifyMany(
            users: $admins,
            type: NotificationType::StudentEnrolled,
            title: 'New Student Enrollment',
            message: "{$student->name} has enrolled in {$semester->name}.",
            data: [
                'semester_id' => $semester->id,
                'student_id' => $student->id,
            ],
            link: "/admin/enrollments",
        );
    }
}
