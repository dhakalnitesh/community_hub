<?php

namespace App\Models\Platform;

use Illuminate\Database\Eloquent\Model;

class SpamLog extends Model
{
    protected $fillable = [
        'event_type', 'loggable_type', 'loggable_id',
        'uuid', 'ip_hash', 'spam_score', 'metadata',
    ];

    protected function casts(): array
    {
        return [
            'spam_score' => 'float',
            'metadata' => 'array',
        ];
    }

    public function loggable(): \Illuminate\Database\Eloquent\Relations\MorphTo
    {
        return $this->morphTo();
    }
}