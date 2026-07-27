<?php

namespace App\Events;

use App\Models\Community\Discussion;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class QuestionPosted
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Discussion $discussion,
    ) {}
}
