<?php

namespace App\Models\Academic;

use App\Models\Core\User;


use Illuminate\Database\Eloquent\Model;

class Resource extends Model
{
    use \App\Models\Traits\TeachableScope;

    protected $fillable = [
        'subject_id',
        'teacher_id',
        'title',
        'description',
        'file_url',
        'type',
    ];

    public function subject(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    public function teacher(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }
}
