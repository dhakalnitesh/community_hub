<?php

namespace App\Events;

use App\Models\Academic\Subject;
use App\Models\Core\User;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TeacherAssigned
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Subject $subject,
        public User $teacher,
    ) {}
}
