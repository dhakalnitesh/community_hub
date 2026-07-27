<?php

namespace App\Events;

use App\Models\Grievance\Grievance;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class GrievanceSubmitted
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Grievance $grievance,
    ) {}
}