<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StudentProject extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'institution_id',
        'title',
        'description',
        'tech_stack',
        'github_url',
        'live_demo_url',
        'thumbnail_url',
        'status',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(ProjectReview::class)->latest();
    }
}