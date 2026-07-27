<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;

use App\Enums\NotificationType;
use App\Events\QuestionAnswered;
use App\Services\NotificationService;

class NotifyQuestionAnswered implements ShouldQueue
{
    public function __construct(
        protected NotificationService $notificationService,
    ) {}

    public function handle(QuestionAnswered $event): void
    {
        $answer = $event->answer;
        $answer->loadMissing('discussion.user', 'user');

        $discussion = $answer->discussion;
        $questionAuthor = $discussion->user;

        // Do not notify if the author answers their own question
        if ($questionAuthor->id === $answer->user_id) {
            return;
        }

        $answererName = $answer->is_anonymous ? ($answer->user->anonymous_name ?? 'Anonymous') : $answer->user->name;

        $this->notificationService->notify(
            user: $questionAuthor,
            type: NotificationType::QuestionAnswered,
            title: 'New Answer',
            message: "{$answererName} answered your question \"{$discussion->title}\".",
            data: [
                'discussion_id' => $discussion->id,
                'answer_id' => $answer->id,
            ],
            link: "/discussions/{$discussion->id}",
        );
    }
}
