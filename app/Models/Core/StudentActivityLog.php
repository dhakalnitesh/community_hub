<?php

namespace App\Models\Core;

use App\Models\Academic\Subject;


use Illuminate\Database\Eloquent\Model;

class StudentActivityLog extends Model
{
    protected $fillable = [
        'student_id',
        'subject_id',
        'action',
        'loggable_id',
        'loggable_type',
    ];

    public function student(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function subject(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    public function loggable(): \Illuminate\Database\Eloquent\Relations\MorphTo
    {
        return $this->morphTo();
    }
}
