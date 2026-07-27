<?php

namespace App\Models\Grievance;

use App\Models\Core\User;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GrievanceEvent extends Model
{
    use HasFactory;

    protected $fillable = [
        'grievance_id', 'user_id', 'type', 'description', 'is_public', 'metadata',
    ];

    protected function casts(): array
    {
        return [
            'is_public' => 'boolean',
            'metadata' => 'array',
        ];
    }

    public function grievance(): BelongsTo
    {
        return $this->belongsTo(Grievance::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }
}