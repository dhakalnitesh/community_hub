<?php

namespace App\Http\Controllers\Community;

use App\Models\Community\Discussion;
use App\Models\Community\DiscussionAnswer;
use App\Models\Community\Vote;
use App\Models\Core\StudentActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Http\Controllers\Controller;

class VoteController extends Controller
{
    public function toggle(Request $request)
    {
        $validated = $request->validate([
            'votable_type' => 'required|string|in:discussion,discussion_answer',
            'votable_id' => 'required|integer',
            'type' => 'required|string|in:upvote,downvote',
        ]);

        $modelClass = \Illuminate\Database\Eloquent\Relations\Relation::getMorphedModel($validated['votable_type']);
        if (!$modelClass) {
            abort(400, 'Invalid votable type.');
        }
        $votable = $modelClass::findOrFail($validated['votable_id']);

        $existingVote = Vote::where([
            'user_id' => Auth::id(),
            'votable_type' => $validated['votable_type'],
            'votable_id' => $validated['votable_id'],
        ])->first();

        $logAction = null;

        if ($existingVote) {
            if ($existingVote->type === $validated['type']) {
                $existingVote->delete();
                $logAction = null; // Don't log un-votes
            } else {
                $existingVote->update(['type' => $validated['type']]);
                $logAction = 'voted_' . $validated['type'];
            }
        } else {
            Vote::create([
                'user_id' => Auth::id(),
                'votable_type' => $validated['votable_type'],
                'votable_id' => $validated['votable_id'],
                'type' => $validated['type'],
            ]);
            $logAction = 'voted_' . $validated['type'];
        }

        if ($logAction) {
            StudentActivityLog::create([
                'student_id' => Auth::id(),
                'subject_id' => null,
                'action' => $logAction,
                'loggable_id' => $validated['votable_id'],
                'loggable_type' => $modelClass,
            ]);
        }

        return redirect()->back();
    }
}
