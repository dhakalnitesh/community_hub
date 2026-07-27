<?php

namespace App\Policies;

use App\Models\Mentorship\StudentProject;
use App\Models\Core\User;

class StudentProjectPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, StudentProject $studentProject): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->isStudent();
    }

    public function update(User $user, StudentProject $studentProject): bool
    {
        return $user->id === $studentProject->user_id || $user->isSuperAdmin();
    }

    public function delete(User $user, StudentProject $studentProject): bool
    {
        return $user->id === $studentProject->user_id || $user->isSuperAdmin();
    }
}
