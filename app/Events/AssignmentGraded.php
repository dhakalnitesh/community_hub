<?php

namespace App\Events;

use App\Models\Academic\Submission;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AssignmentGraded
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Submission $submission,
    ) {}
}
