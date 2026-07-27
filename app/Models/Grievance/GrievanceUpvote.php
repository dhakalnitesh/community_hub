<?php

namespace App\Models\Grievance;

use App\Models\Core\User;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GrievanceUpvote extends Model
{
    use HasFactory;

    protected $fillable = [
        'grievance_id', 'user_id', 'session_id', 'anonymous_uuid',
    ];

    public function grievance(): BelongsTo
    {
        return $this->belongsTo(Grievance::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public static function hasUpvoted(int $grievanceId, ?int $userId, ?string $sessionId): bool
    {
        if ($userId) {
            return static::where('grievance_id', $grievanceId)
                ->where('user_id', $userId)
                ->exists();
        }

        if ($sessionId) {
            return static::where('grievance_id', $grievanceId)
                ->whereNull('user_id')
                ->where('session_id', $sessionId)
                ->exists();
        }

        return false;
    }

    public static function toggle(int $grievanceId, ?int $userId, ?string $sessionId, ?string $uuid): array
    {
        if ($userId) {
            $existing = static::where('grievance_id', $grievanceId)
                ->where('user_id', $userId)
                ->first();

            if ($existing) {
                $existing->delete();
                return ['upvoted' => false, 'count' => static::where('grievance_id', $grievanceId)->count()];
            }

            static::create([
                'grievance_id' => $grievanceId,
                'user_id' => $userId,
                'anonymous_uuid' => $uuid,
            ]);

            return ['upvoted' => true, 'count' => static::where('grievance_id', $grievanceId)->count()];
        }

        $existing = static::where('grievance_id', $grievanceId)
            ->whereNull('user_id')
            ->where('session_id', $sessionId)
            ->first();

        if ($existing) {
            $existing->delete();
            return ['upvoted' => false, 'count' => static::where('grievance_id', $grievanceId)->count()];
        }

        static::create([
            'grievance_id' => $grievanceId,
            'session_id' => $sessionId,
            'anonymous_uuid' => $uuid,
        ]);

        return ['upvoted' => true, 'count' => static::where('grievance_id', $grievanceId)->count()];
    }
}