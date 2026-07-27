<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;

use App\Enums\NotificationType;
use App\Events\QuestionPosted;
use App\Services\NotificationService;
use App\Models\Subject;

class NotifyQuestionPosted implements ShouldQueue
{
    public function __construct(
        protected NotificationService $notificationService,
    ) {}

    public function handle(QuestionPosted $event): void
    {
        $discussion = $event->discussion;
        
        // Only notify if it's a subject-scoped discussion
        if ($discussion->discussionable_type === 'subject') {
            $subject = Subject::with('teachers')->find($discussion->discussionable_id);
            
            if ($subject) {
                $teachers = $subject->teachers;
                
                $this->notificationService->notifyMany(
                    users: $teachers,
                    type: NotificationType::QuestionPosted,
                    title: 'New Question Posted',
                    message: "A new question \"{$discussion->title}\" was posted in {$subject->name}.",
                    data: [
                        'discussion_id' => $discussion->id,
                        'subject_id' => $subject->id,
                    ],
                    link: "/discussions/{$discussion->id}",
                    excludeUserId: $discussion->user_id,
                );
            }
        }
    }
}
