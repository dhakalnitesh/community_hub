<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;

use App\Enums\NotificationType;
use App\Events\AnswerAccepted;
use App\Services\NotificationService;

class NotifyAnswerAccepted implements ShouldQueue
{
    public function __construct(
        protected NotificationService $notificationService,
    ) {}

    public function handle(AnswerAccepted $event): void
    {
        $answer = $event->answer;
        $answer->loadMissing('user', 'discussion');
        
        $answerAuthor = $answer->user;
        $discussion = $answer->discussion;
        
        // Don't notify if they accepted their own answer
        if ($discussion->user_id === $answer->user_id) {
            return;
        }

        $this->notificationService->notify(
            user: $answerAuthor,
            type: NotificationType::AnswerAccepted,
            title: 'Answer Accepted',
            message: "Your answer to \"{$discussion->title}\" was accepted as the solution.",
            data: [
                'discussion_id' => $discussion->id,
                'answer_id' => $answer->id,
            ],
            link: "/discussions/{$discussion->id}",
        );
    }
}
