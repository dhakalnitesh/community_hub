<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Grievance\Grievance;
use App\Models\Grievance\GrievanceComment;
use App\Models\Platform\SpamLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ModerationController extends Controller
{
    public function index()
    {
        $flaggedGrievances = Grievance::where('moderation_status', 'pending')
            ->orWhereNotNull('hidden_at')
            ->with(['institution', 'category'])
            ->latest()
            ->paginate(20)
            ->through(fn($g) => [
                'id' => $g->id,
                'reference_code' => $g->reference_code,
                'title' => $g->title,
                'status' => $g->status,
                'moderation_status' => $g->moderation_status,
                'spam_score' => $g->spam_score,
                'institution' => $g->institution?->name,
                'category' => $g->category?->name,
                'hidden_at' => $g->hidden_at,
                'created_at' => $g->created_at->toISOString(),
            ]);

        return Inertia::render('Admin/Grievances/Moderation', [
            'flaggedGrievances' => $flaggedGrievances,
        ]);
    }

    public function hide(Grievance $grievance)
    {
        $grievance->update(['hidden_at' => now()]);

        SpamLog::create([
            'event_type' => 'moderation_hide',
            'loggable_type' => Grievance::class,
            'loggable_id' => $grievance->id,
            'spam_score' => $grievance->spam_score,
        ]);

        return back()->with('success', 'Grievance hidden from public view.');
    }

    public function dismiss(Grievance $grievance)
    {
        $grievance->update(['moderation_status' => 'approved', 'hidden_at' => null]);

        return back()->with('success', 'Grievance approved.');
    }

    public function pendingComments()
    {
        $comments = GrievanceComment::where('is_approved', false)
            ->with(['grievance', 'user'])
            ->latest()
            ->paginate(20)
            ->through(fn($c) => [
                'id' => $c->id,
                'body' => $c->body,
                'author' => $c->authorName(),
                'grievance_id' => $c->grievance_id,
                'grievance_title' => $c->grievance?->title,
                'created_at' => $c->created_at->toISOString(),
            ]);

        return Inertia::render('Admin/Grievances/PendingComments', [
            'comments' => $comments,
        ]);
    }

    public function approveComment(GrievanceComment $comment)
    {
        $comment->update(['is_approved' => true]);
        return back()->with('success', 'Comment approved.');
    }

    public function hideComment(GrievanceComment $comment)
    {
        $comment->update(['hidden_at' => now()]);
        return back()->with('success', 'Comment hidden.');
    }

    public function spamLogs()
    {
        $logs = SpamLog::latest()->paginate(50);

        return Inertia::render('Admin/SpamLogs', [
            'logs' => $logs->through(fn($l) => [
                'id' => $l->id,
                'event_type' => $l->event_type,
                'uuid' => $l->uuid,
                'ip_hash' => $l->ip_hash,
                'spam_score' => $l->spam_score,
                'metadata' => $l->metadata,
                'created_at' => $l->created_at->toISOString(),
            ]),
        ]);
    }
}