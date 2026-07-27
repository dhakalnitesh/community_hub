<?php

namespace App\Events;

use App\Models\Community\DiscussionAnswer;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class QuestionAnswered
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public DiscussionAnswer $answer,
    ) {}
}
