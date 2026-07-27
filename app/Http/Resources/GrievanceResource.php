<?php

namespace App\Http\Resources;

use App\Services\BsDateService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GrievanceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $userId = auth()->id();
        $sessionId = $userId ? null : session()->getId();

        return [
            'id' => $this->id,
            'reference_code' => $this->reference_code,
            'title' => $this->title,
            'category' => $this->whenLoaded('category', fn() => $this->category?->name),
            'priority' => $this->priority,
            'institution' => $this->whenLoaded('institution', fn() => $this->institution?->name),
            'semester' => $this->whenLoaded('semester', fn() => $this->semester?->name),
            'subject' => $this->whenLoaded('subject', fn() => $this->subject?->name),
            'description' => $this->description,
            'status' => $this->status,
            'is_anonymous' => $this->is_anonymous,
            'created_at' => $this->created_at->toISOString(),
            'bs_created_at' => BsDateService::toBsString($this->created_at, 'datetime_en'),
            'resolved_at' => $this->resolved_at?->toISOString(),
            'resolution_summary' => $this->resolution_summary,
            'resolved_by_name' => $this->whenLoaded('resolvedBy', fn() => $this->resolvedBy?->name),
            'assigned_to_name' => $this->whenLoaded('assignedUser', fn() => $this->assignedUser?->name),
            'has_upvoted' => $this->isUpvotedBy($userId, $sessionId),
            'upvotes_count' => $this->upvotesCount(),
            'comments_count' => $this->commentsCount(),
            'events' => GrievanceEventResource::collection($this->whenLoaded('events')),
            'media' => GrievanceMediaResource::collection($this->whenLoaded('media')),
        ];
    }
}
