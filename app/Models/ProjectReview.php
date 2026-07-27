<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectReview extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_project_id',
        'user_id',
        'content',
        'is_endorsed',
    ];

    protected $casts = [
        'is_endorsed' => 'boolean',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(StudentProject::class, 'student_project_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
