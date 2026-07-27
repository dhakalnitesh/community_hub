<?php

namespace App\Events;

use App\Models\Mentorship\ProjectReview;
use App\Models\Mentorship\StudentProject;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ProjectEndorsed
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public StudentProject $project,
        public ProjectReview $review
    ) {}
}
