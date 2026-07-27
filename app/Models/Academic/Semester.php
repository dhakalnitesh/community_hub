<?php

namespace App\Models\Academic;

use App\Models\Core\User;
use App\Models\Core\Institution;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Semester extends Model
{
    use HasFactory;
    protected $fillable = [
        'institution_id',
        'name',
        'academic_year',
        'start_date',
        'end_date',
        'invite_code',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'is_active' => 'boolean',
        ];
    }

    public function institution(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function sections(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Section::class);
    }

    public function subjects(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Subject::class);
    }

    public function students(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(User::class, 'semester_students', 'semester_id', 'student_id')
            ->withPivot('status', 'joined_at', 'section_id')
            ->withTimestamps();
    }

    public function activeStudents(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->students()->wherePivot('status', 'active');
    }
}
