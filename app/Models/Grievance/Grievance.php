<?php

namespace App\Models\Grievance;

use App\Models\Academic\Semester;
use App\Models\Academic\Subject;
use App\Models\Core\User;
use App\Models\Core\Institution;


use App\Services\BsDateService;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class Grievance extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id', 'institution_id', 'semester_id', 'subject_id', 'reference_code',
        'category_id', 'title', 'description', 'priority', 'user_priority',
        'admin_priority', 'priority_reviewed_at', 'priority_reviewed_by',
        'status', 'assigned_to', 'is_anonymous', 'reporter_ip',
        'reporter_ip_hash', 'anonymous_uuid', 'photo_path', 'video_path',
        'spam_score', 'hidden_at', 'moderation_status', 'duplicate_of_id',
        'resolved_at', 'resolution_summary', 'resolved_by',
        'feedback_rating', 'feedback_comment', 'feedback_at',
    ];

    protected $appends = ['bs_created_at', 'bs_updated_at', 'bs_resolved_at'];

    protected function casts(): array
    {
        return [
            'resolved_at' => 'datetime',
            'feedback_at' => 'datetime',
            'hidden_at' => 'datetime',
            'is_anonymous' => 'boolean',
            'spam_score' => 'float',
            'priority_reviewed_at' => 'datetime',
        ];
    }

    public function scopeVisible($query)
    {
        return $query->whereNull('hidden_at');
    }

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function submitter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function semester(): BelongsTo
    {
        return $this->belongsTo(Semester::class);
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(GrievanceCategory::class, 'category_id');
    }

    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function resolvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'resolved_by');
    }

    public function priorityReviewedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'priority_reviewed_by');
    }

    public function upvotes(): HasMany
    {
        return $this->hasMany(GrievanceUpvote::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(GrievanceComment::class);
    }

    public function events(): HasMany
    {
        return $this->hasMany(GrievanceEvent::class);
    }

    public function media(): HasMany
    {
        return $this->hasMany(GrievanceMedia::class);
    }

    public function duplicateOf(): BelongsTo
    {
        return $this->belongsTo(self::class, 'duplicate_of_id');
    }

    public function duplicates(): HasMany
    {
        return $this->hasMany(self::class, 'duplicate_of_id');
    }

    public function getBsCreatedAtAttribute(): ?string
    {
        return $this->created_at ? BsDateService::toBsString($this->created_at, 'short') : null;
    }

    public function getBsUpdatedAtAttribute(): ?string
    {
        return $this->updated_at ? BsDateService::toBsString($this->updated_at, 'short') : null;
    }

    public function getBsResolvedAtAttribute(): ?string
    {
        return $this->resolved_at ? BsDateService::toBsString($this->resolved_at, 'short') : null;
    }

    public function upvotesCount(): int
    {
        return Cache::remember("grievance_upvotes_{$this->id}", 300, fn() => $this->upvotes()->count());
    }

    public function commentsCount(): int
    {
        return $this->comments()->count();
    }

    public function isUpvotedBy(?int $userId, ?string $sessionId): bool
    {
        return GrievanceUpvote::hasUpvoted($this->id, $userId, $sessionId);
    }

    public static function generateReferenceCode(int $institutionId): string
    {
        $inst = Institution::find($institutionId);
        $clean = $inst ? preg_replace('/[^A-Za-z0-9]/', '', $inst->name) : '';
        $prefix = strtoupper(substr($clean, 0, 3)) ?: 'EDU';

        return DB::transaction(function () use ($prefix) {
            $maxAttempts = 5;
            for ($i = 0; $i < $maxAttempts; $i++) {
                $seq = DB::table('reference_code_sequences')->insertGetId([
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                $code = $prefix . '-' . str_pad($seq, 6, '0', STR_PAD_LEFT);

                $exists = static::where('reference_code', $code)->exists();
                if (!$exists) {
                    return $code;
                }
            }

            $seq = DB::table('reference_code_sequences')->insertGetId([
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $code = $prefix . '-' . str_pad($seq, 6, '0', STR_PAD_LEFT);
            $code .= chr(rand(65, 90));

            return $code;
        });
    }

    public function effectivePriority(): string
    {
        return $this->admin_priority ?? $this->priority;
    }
}