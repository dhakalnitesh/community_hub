<?php

namespace App\Policies;

use App\Models\DiscussionAnswer;
use App\Models\User;

class DiscussionAnswerPolicy
{
    public function create(User $user): bool
    {
        return in_array($user->role, ['student', 'teacher']);
    }

    public function update(User $user, DiscussionAnswer $answer): bool
    {
        return $user->id === $answer->user_id;
    }

    public function delete(User $user, DiscussionAnswer $answer): bool
    {
        if ($user->id === $answer->user_id || $user->isSuperAdmin()) {
            return true;
        }

        if ($user->isInstitutionAdmin()) {
            $discussion = $answer->discussion;
            $discussionable = $discussion->discussionable;
            if ($discussionable instanceof \App\Models\Subject) {
                return $user->institutions()->where('institutions.id', $discussionable->semester->institution_id)->exists();
            }
            if ($discussionable instanceof \App\Models\Assignment) {
                return $user->institutions()->where('institutions.id', $discussionable->subject->semester->institution_id)->exists();
            }
        }

        if ($user->isTeacher()) {
            $discussion = $answer->discussion;
            $discussionable = $discussion->discussionable;
            if ($discussionable instanceof \App\Models\Subject) {
                return $user->taughtSubjects()->where('subject_id', $discussionable->id)->exists();
            }
            if ($discussionable instanceof \App\Models\Assignment) {
                return $user->taughtSubjects()->where('subject_id', $discussionable->subject_id)->exists();
            }
        }

        return false;
    }

    public function endorse(User $user, DiscussionAnswer $answer): bool
    {
        if ($user->isSuperAdmin()) {
            return true;
        }

        if ($user->isInstitutionAdmin()) {
            $discussion = $answer->discussion;
            $discussionable = $discussion->discussionable;
            if ($discussionable instanceof \App\Models\Subject) {
                return $user->institutions()->where('institutions.id', $discussionable->semester->institution_id)->exists();
            }
            if ($discussionable instanceof \App\Models\Assignment) {
                return $user->institutions()->where('institutions.id', $discussionable->subject->semester->institution_id)->exists();
            }
        }

        if ($user->isTeacher()) {
            $discussion = $answer->discussion;
            $discussionable = $discussion->discussionable;
            if ($discussionable instanceof \App\Models\Subject) {
                return $user->taughtSubjects()->where('subject_id', $discussionable->id)->exists();
            }
            if ($discussionable instanceof \App\Models\Assignment) {
                return $user->taughtSubjects()->where('subject_id', $discussionable->subject_id)->exists();
            }
        }

        return false;
    }
}
