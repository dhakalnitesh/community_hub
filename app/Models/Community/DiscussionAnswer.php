<?php

namespace App\Models\Community;

use App\Models\Core\User;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DiscussionAnswer extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'discussion_id',
        'user_id',
        'body',
        'is_anonymous',
        'is_accepted',
        'is_teacher_endorsed',
    ];

    protected function casts(): array
    {
        return [
            'is_anonymous' => 'boolean',
            'is_accepted' => 'boolean',
            'is_teacher_endorsed' => 'boolean',
        ];
    }

    protected $appends = ['author_name'];
    protected $with = ['user'];

    public function discussion(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Discussion::class);
    }

    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class);
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
}
