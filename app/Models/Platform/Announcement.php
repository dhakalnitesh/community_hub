<?php

namespace App\Models\Platform;

use App\Models\Academic\Subject;
use App\Models\Core\User;


use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    use \App\Models\Traits\TeachableScope;

    protected $fillable = [
        'subject_id',
        'user_id',
        'title',
        'content',
    ];

    public function subject(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
