<?php

namespace App\Policies;

use App\Models\Academic\Assignment;
use App\Models\Community\Discussion;
use App\Models\Academic\Subject;
use App\Models\Core\User;

class DiscussionPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    private function canViewSubject(User $user, Subject $subject): bool
    {
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

    public function view(User $user, Discussion $discussion): bool
    {
        if ($user->isSuperAdmin()) {
            return true;
        }

        $discussionable = $discussion->discussionable;

        if ($discussion->discussionable_type === null || $discussion->discussionable_type === 'general') {
            return true;
        }

        if ($discussionable instanceof Subject) {
            return $this->canViewSubject($user, $discussionable);
        }

        if ($discussionable instanceof Assignment) {
            return $this->canViewSubject($user, $discussionable->subject);
        }

        return $user->id === $discussion->user_id;
    }

    public function create(User $user): bool
    {
        return in_array($user->role, ['student', 'teacher']);
    }

    public function update(User $user, Discussion $discussion): bool
    {
        if ($user->id === $discussion->user_id || $user->isSuperAdmin()) {
            return true;
        }

        if ($user->isInstitutionAdmin()) {
            $discussionable = $discussion->discussionable;
            if ($discussionable instanceof Subject) {
                return $user->institutions()->where('institutions.id', $discussionable->semester->institution_id)->exists();
            }
            if ($discussionable instanceof Assignment) {
                return $user->institutions()->where('institutions.id', $discussionable->subject->semester->institution_id)->exists();
            }
        }

        return false;
    }

    public function delete(User $user, Discussion $discussion): bool
    {
        if ($user->isSuperAdmin() || $user->id === $discussion->user_id) {
            return true;
        }

        $discussionable = $discussion->discussionable;

        if ($user->isInstitutionAdmin()) {
            if ($discussionable instanceof Subject) {
                return $user->institutions()->where('institutions.id', $discussionable->semester->institution_id)->exists();
            }
            if ($discussionable instanceof Assignment) {
                return $user->institutions()->where('institutions.id', $discussionable->subject->semester->institution_id)->exists();
            }
        }

        if ($discussionable instanceof Subject && $user->isTeacher()) {
            return $user->taughtSubjects()->where('subject_id', $discussionable->id)->exists();
        }

        if ($discussionable instanceof Assignment && $user->isTeacher()) {
            return $user->taughtSubjects()->where('subject_id', $discussionable->subject_id)->exists();
        }

        return false;
    }
}
