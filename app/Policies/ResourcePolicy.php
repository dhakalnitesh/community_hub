<?php

namespace App\Policies;

use App\Models\Academic\Resource;
use App\Models\Core\User;

class ResourcePolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Resource $resource): bool
    {
        if ($user->isSuperAdmin()) {
            return true;
        }

        $subject = $resource->subject;

        if ($user->isTeacher()) {
            return $user->taughtSubjects()->where('subject_id', $subject->id)->exists();
        }

        if ($user->isStudent()) {
            return $user->enrolledSemesters()->where('semester_id', $subject->semester_id)->exists();
        }

        if ($user->isInstitutionAdmin()) {
            return $user->institutions()->where('institutions.id', $subject->semester->institution_id)->exists();
        }

        return false;
    }

    public function create(User $user): bool
    {
        return in_array($user->role, ['teacher', 'institution_admin', 'super_admin']);
    }

    public function update(User $user, Resource $resource): bool
    {
        if ($user->isSuperAdmin() || $user->isInstitutionAdmin()) {
            return true;
        }

        return $user->id === $resource->teacher_id;
    }

    public function delete(User $user, Resource $resource): bool
    {
        return $this->update($user, $resource);
    }
}
