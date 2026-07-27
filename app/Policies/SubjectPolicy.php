<?php

namespace App\Policies;

use App\Models\Academic\Subject;
use App\Models\Core\User;

class SubjectPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isInstitutionAdmin() || $user->isSuperAdmin();
    }

    public function view(User $user, Subject $subject): bool
    {
        if ($user->isSuperAdmin()) {
            return true;
        }

        if ($user->isInstitutionAdmin()) {
            return $user->institutions()
                ->where('institutions.id', $subject->semester->institution_id)
                ->exists();
        }

        return false;
    }

    public function create(User $user): bool
    {
        return $user->isInstitutionAdmin() || $user->isSuperAdmin();
    }

    public function update(User $user, Subject $subject): bool
    {
        return $this->view($user, $subject);
    }

    public function delete(User $user, Subject $subject): bool
    {
        return $this->view($user, $subject);
    }
}
