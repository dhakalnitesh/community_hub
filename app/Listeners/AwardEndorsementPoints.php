<?php

namespace App\Listeners;

use App\Events\ProjectEndorsed;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class AwardEndorsementPoints implements ShouldQueue
{
    use InteractsWithQueue;

    public function handle(ProjectEndorsed $event): void
    {
        $student = $event->project->user;
        
        if ($student) {
            $student->increment('reputation', 20);
        }
    }
}
