<?php

namespace App\Models\Academic;

use App\Models\Community\Discussion;
use App\Models\Platform\Announcement;
use App\Models\Core\User;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory;
    protected $fillable = [
        'semester_id',
        'name',
        'code',
        'description',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function semester(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Semester::class);
    }

    public function teachers(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(User::class, 'subject_teachers', 'subject_id', 'teacher_id')
            ->withPivot('section_id', 'assigned_at')
            ->withTimestamps();
    }

    public function assignments(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Assignment::class);
    }

    public function resources(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Resource::class);
    }

    public function announcements(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Announcement::class);
    }

    public function discussions(): \Illuminate\Database\Eloquent\Relations\MorphMany
    {
        return $this->morphMany(Discussion::class, 'discussionable');
    }

    public function scopeAccessibleByUser($query, User $user)
    {
        if ($user->isSuperAdmin()) {
            return $query;
        }
        
        if ($user->isTeacher()) {
            return $query->whereHas('teachers', function ($q) use ($user) {
                $q->where('users.id', $user->id);
            });
        }
        
        if ($user->isStudent()) {
            $semesterIds = $user->enrolledSemesters()->pluck('semesters.id');
            return $query->whereIn('semester_id', $semesterIds);
        }
        
        if ($user->isInstitutionAdmin()) {
            $institutionIds = $user->institutions()->pluck('institutions.id');
            return $query->whereHas('semester', function ($q) use ($institutionIds) {
                $q->whereIn('institution_id', $institutionIds);
            });
        }

        return $query->whereRaw('1 = 0');
    }
}
