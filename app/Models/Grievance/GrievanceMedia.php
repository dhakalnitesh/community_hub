<?php

namespace App\Models\Grievance;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GrievanceMedia extends Model
{
    protected $fillable = [
        'grievance_id', 'path', 'type', 'submitted_by_session',
    ];

    public function grievance(): BelongsTo
    {
        return $this->belongsTo(Grievance::class);
    }
}