<?php

namespace App\Services;

use App\Models\Grievance\Grievance;

class MergeService
{
    public function autoMerge(Grievance $child, Grievance $parent): void
    {
        $child->update([
            'status' => 'merged',
            'duplicate_of_id' => $parent->id,
        ]);

        $child->events()->create([
            'type' => 'merged',
            'description' => "Combined with similar report {$parent->reference_code}",
            'is_public' => true,
        ]);

        $parent->events()->create([
            'type' => 'merged',
            'description' => 'Another student also reported this issue',
            'is_public' => true,
        ]);

        foreach ($child->media as $media) {
            $parent->media()->create([
                'path' => $media->path,
                'type' => $media->type,
            ]);
        }
    }
}