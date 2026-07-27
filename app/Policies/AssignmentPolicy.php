<?php

namespace App\Policies;

use App\Models\Academic\Assignment;
use App\Models\Core\User;

class AssignmentPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Assignment $assignment): bool
    {
        if ($user->isSuperAdmin()) {
            return true;
        }

        $subject = $assignment->subject;

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

    public function update(User $user, Assignment $assignment): bool
    {
        if ($user->isSuperAdmin() || $user->isInstitutionAdmin()) {
            return true;
        }

        return $user->id === $assignment->teacher_id;
    }

    public function delete(User $user, Assignment $assignment): bool
    {
        return $this->update($user, $assignment);
    }
}
