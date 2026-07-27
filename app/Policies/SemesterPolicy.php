<?php

namespace App\Policies;

use App\Models\Academic\Semester;
use App\Models\Core\User;

class SemesterPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isInstitutionAdmin() || $user->isSuperAdmin();
    }

    public function view(User $user, Semester $semester): bool
    {
        if ($user->isSuperAdmin()) {
            return true;
        }

        if ($user->isInstitutionAdmin()) {
            return $user->institutions()->where('institutions.id', $semester->institution_id)->exists();
        }

        return false;
    }

    public function create(User $user): bool
    {
        return $user->isInstitutionAdmin() || $user->isSuperAdmin();
    }

    public function update(User $user, Semester $semester): bool
    {
        return $this->view($user, $semester);
    }

    public function delete(User $user, Semester $semester): bool
    {
        return $this->view($user, $semester);
    }
}
