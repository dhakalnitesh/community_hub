<?php

namespace App\Policies;

use App\Models\Academic\Submission;
use App\Models\Core\User;

class SubmissionPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Submission $submission): bool
    {
        if ($user->isSuperAdmin() || $user->isInstitutionAdmin()) {
            return true;
        }

        // Student can view own submission
        if ($user->isStudent() && $submission->student_id === $user->id) {
            return true;
        }

        // Teacher can view submission for their assignment
        if ($user->isTeacher()) {
            return $user->taughtSubjects()
                ->where('subject_id', $submission->assignment->subject_id)
                ->exists();
        }

        return false;
    }

    public function create(User $user): bool
    {
        return $user->isStudent();
    }

    public function update(User $user, Submission $submission): bool
    {
        if ($user->isSuperAdmin() || $user->isInstitutionAdmin()) {
            return true;
        }

        // Only the teacher of the assignment can grade
        if ($user->isTeacher()) {
            return $user->taughtSubjects()
                ->where('subject_id', $submission->assignment->subject_id)
                ->exists();
        }

        return false;
    }

    public function delete(User $user, Submission $submission): bool
    {
        return $this->update($user, $submission);
    }
}
