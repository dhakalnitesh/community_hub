<?php

namespace App\Models\Traits;

use App\Models\Academic\Subject;


use App\Models\Core\User;

trait TeachableScope
{
    public function scopeForUser($query, User $user)
    {
        if ($user->isSuperAdmin()) {
            return $query;
        }

        if ($user->isInstitutionAdmin()) {
            $institutionIds = $user->institutions()->pluck('institutions.id');

            return $query->whereHas('subject.semester', function ($q) use ($institutionIds) {
                $q->whereIn('institution_id', $institutionIds);
            });
        }

        if ($user->isTeacher()) {
            $subjectIds = $user->taughtSubjects()->pluck('subject_id');

            return $query->whereIn('subject_id', $subjectIds);
        }

        if ($user->isStudent()) {
            $semesterIds = $user->enrolledSemesters()->pluck('semesters.id');
            $subjectIds = \App\Models\Academic\Subject::whereIn('semester_id', $semesterIds)->pluck('id');

            return $query->whereIn('subject_id', $subjectIds);
        }

        return $query->whereRaw('0 = 1');
    }
}
