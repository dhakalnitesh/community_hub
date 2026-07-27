<?php

namespace App\Models\Grievance;

use App\Models\Core\User;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class GrievanceComment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'grievance_id', 'user_id', 'session_id', 'parent_id',
        'body', 'is_public', 'is_approved', 'hidden_at',
    ];

    protected function casts(): array
    {
        return [
            'is_public' => 'boolean',
            'is_approved' => 'boolean',
            'hidden_at' => 'datetime',
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

    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function replies(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id');
    }

    public function scopeVisible($query)
    {
        return $query->whereNull('hidden_at');
    }

    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }

    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }

    public function scopeRoot($query)
    {
        return $query->whereNull('parent_id');
    }

    public function authorName(): string
    {
        if ($this->user_id && $this->user) {
            return $this->user->name;
        }
        return 'Anonymous';
    }
}