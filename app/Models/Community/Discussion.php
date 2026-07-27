<?php

namespace App\Models\Community;

use App\Models\Core\User;
use App\Models\Academic\Subject;
use App\Models\Academic\Semester;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Discussion extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'discussionable_id',
        'discussionable_type',
        'title',
        'body',
        'category',
        'is_anonymous',
        'status',
        'tracking_token',
    ];

    protected function casts(): array
    {
        return [
            'is_anonymous' => 'boolean',
        ];
    }

    protected $appends = ['author_name'];
    protected $with = ['user'];

    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function discussionable(): \Illuminate\Database\Eloquent\Relations\MorphTo
    {
        return $this->morphTo();
    }

    public function answers(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(DiscussionAnswer::class);
    }

    public function votes(): \Illuminate\Database\Eloquent\Relations\MorphMany
    {
        return $this->morphMany(Vote::class, 'votable');
    }

    public function getAuthorNameAttribute(): string
    {
        if ($this->is_anonymous) {
            return $this->user->anonymous_name ?? 'Anonymous';
        }
        return $this->user->name;
    }

    public function scopeOpen($query)
    {
        return $query->where('status', 'open');
    }

    public function scopeAuthorizedForUser($query, User $user)
    {
        if ($user->isSuperAdmin()) {
            return $query;
        }

        if ($user->isTeacher()) {
            $subjectIds = $user->taughtSubjects()->pluck('subjects.id');
            return $query->where(function ($q) use ($subjectIds) {
                $q->where('discussionable_type', 'subject')
                  ->whereIn('discussionable_id', $subjectIds);
            });
        }

        if ($user->isStudent()) {
            $semesterIds = $user->enrolledSemesters()->pluck('semesters.id');
            $subjectIds = Subject::whereIn('semester_id', $semesterIds)->pluck('id');
            return $query->where(function ($q) use ($subjectIds) {
                $q->where('discussionable_type', 'subject')
                  ->whereIn('discussionable_id', $subjectIds);
            });
        }

        if ($user->isInstitutionAdmin()) {
            $institutionIds = $user->institutions()->pluck('institutions.id');
            $semesterIds = Semester::whereIn('institution_id', $institutionIds)->pluck('id');
            $subjectIds = Subject::whereIn('semester_id', $semesterIds)->pluck('id');
            return $query->where(function ($q) use ($subjectIds) {
                $q->where('discussionable_type', 'subject')
                  ->whereIn('discussionable_id', $subjectIds);
            });
        }

        return $query->whereRaw('1 = 0'); // Deny if no role matches
    }
}
