<?php

namespace App\Events;

use App\Models\Grievance\Grievance;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class GrievanceStatusUpdated
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Grievance $grievance,
        public string $oldStatus,
        public string $newStatus,
    ) {}
}