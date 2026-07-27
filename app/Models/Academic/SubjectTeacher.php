<?php

namespace App\Models\Academic;

use App\Models\Core\User;


use Illuminate\Database\Eloquent\Relations\Pivot;

class SubjectTeacher extends Pivot
{
    protected $fillable = [
        'subject_id',
        'section_id',
        'teacher_id',
        'assigned_at',
    ];

    protected function casts(): array
    {
        return [
            'assigned_at' => 'datetime',
        ];
    }

    public function subject(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    public function section(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Section::class);
    }

    public function teacher(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }
}
