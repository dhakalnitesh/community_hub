<?php

namespace App\Models\Mentorship;

use App\Models\Community\Discussion;
use App\Models\Core\User;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MentorSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'discussion_id',
        'mentee_id',
        'mentor_id',
        'topic',
        'status',
        'mentor_notes',
    ];

    public function discussion(): BelongsTo
    {
        return $this->belongsTo(Discussion::class);
    }

    public function mentee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'mentee_id');
    }

    public function mentor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'mentor_id');
    }
}