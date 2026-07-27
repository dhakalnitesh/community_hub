<?php

namespace App\Models\Academic;

use App\Models\Core\User;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    use HasFactory;

    protected $fillable = [
        'assignment_id',
        'student_id',
        'attempt_number',
        'content',
        'file_url',
        'submitted_at',
        'score',
        'feedback',
        'is_late',
        'status',
        'is_struggling',
    ];

    protected function casts(): array
    {
        return [
            'submitted_at' => 'datetime',
            'is_late' => 'boolean',
            'is_struggling' => 'boolean',
        ];
    }

    public function assignment(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Assignment::class);
    }

    public function student(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function getAuthorNameAttribute(): string
    {
        return $this->student?->name ?? 'Unknown';
    }

    public function getFileUrlsAttribute(): array
    {
        if (empty($this->file_url)) {
            return [];
        }
        
        $decoded = json_decode($this->file_url, true);
        return is_array($decoded) ? $decoded : [$this->file_url];
    }
}
