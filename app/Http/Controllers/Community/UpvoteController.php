<?php

namespace App\Http\Controllers\Community;

use App\Models\Grievance\Grievance;
use App\Models\Grievance\GrievanceEvent;
use App\Models\Grievance\GrievanceUpvote;
use App\Services\TrustService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

use App\Http\Controllers\Controller;

class UpvoteController extends Controller
{
    public function toggle(Grievance $grievance, Request $request)
    {
        if ($grievance->hidden_at) {
            return $request->wantsJson()
                ? response()->json(['error' => 'Grievance not found.'], 404)
                : redirect()->back()->with('error', 'Grievance not found.');
        }

        $userId = auth()->id();
        $sessionId = $userId ? null : session()->getId();
        $uuid = $request->cookie('_auid');

        $result = GrievanceUpvote::toggle($grievance->id, $userId, $sessionId, $uuid);

        Cache::forget("grievance_upvotes_{$grievance->id}");

        $upvoteCount = $grievance->upvotes()->count();
        if ($upvoteCount === 20 || $upvoteCount === 50) {
            $trustService = app(TrustService::class);
            $newPriority = $trustService->getEffectivePriority($grievance);

            if ($newPriority !== $grievance->priority) {
                $oldPriority = $grievance->priority;
                $grievance->update(['priority' => $newPriority]);

                GrievanceEvent::create([
                    'grievance_id' => $grievance->id,
                    'type' => 'priority_changed',
                    'description' => "Priority auto-escalated from {$oldPriority} to {$newPriority} (community support).",
                    'metadata' => ['from' => $oldPriority, 'to' => $newPriority, 'reason' => 'upvote_milestone'],
                    'is_public' => true,
                ]);
            }
        }

        if ($request->wantsJson()) {
            return response()->json($result);
        }

        return back();
    }

    public function upvoters(Grievance $grievance)
    {
        abort_if($grievance->hidden_at, 404);

        $upvoters = $grievance->upvotes()
            ->with('user')
            ->latest()
            ->get()
            ->map(fn($upvote) => $upvote->user
                ? ['id' => $upvote->user->id, 'name' => $upvote->user->name]
                : ['id' => null, 'name' => 'Anonymous']
            );

        return response()->json(['data' => $upvoters]);
    }
}