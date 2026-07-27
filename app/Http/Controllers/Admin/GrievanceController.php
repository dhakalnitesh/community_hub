<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Grievance\Grievance;
use App\Models\Grievance\GrievanceEvent;
use App\Services\BsDateService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GrievanceController extends Controller
{
    public function index(Request $request)
    {
        $query = Grievance::with(['institution', 'category', 'assignedUser', 'semester', 'subject'])
            ->whereNull('deleted_at');

        if ($request->filled('institution_id')) {
            $query->where('institution_id', $request->institution_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('reference_code', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $sort = $request->get('sort', 'latest');
        $query->when($sort === 'oldest', fn($q) => $q->oldest())
            ->when($sort === 'latest', fn($q) => $q->latest());

        $perPage = min((int) $request->get('per_page', 20), 50);

        $grievances = $query->paginate($perPage)->through(fn($g) => [
            'id' => $g->id,
            'reference_code' => $g->reference_code,
            'title' => $g->title,
            'category' => $g->category?->name,
            'priority' => $g->priority,
            'status' => $g->status,
            'institution' => $g->institution?->name,
            'semester' => $g->semester?->name,
            'subject' => $g->subject?->name,
            'assigned_to' => $g->assignedUser?->name,
            'spam_score' => $g->spam_score,
            'moderation_status' => $g->moderation_status,
            'created_at' => $g->created_at->toISOString(),
            'bs_created_at' => BsDateService::toBsString($g->created_at, 'short'),
            'upvotes_count' => $g->upvotesCount(),
            'comments_count' => $g->commentsCount(),
        ]);

        return Inertia::render('Admin/Grievances/Index', [
            'grievances' => $grievances,
            'filters' => $request->only(['status', 'category_id', 'priority', 'institution_id', 'search', 'sort']),
        ]);
    }

    public function show(Grievance $grievance)
    {
        $grievance->load(['institution', 'semester', 'subject', 'category', 'assignedUser', 'resolvedBy',
            'events' => fn($q) => $q->latest()->limit(50),
            'comments' => fn($q) => $q->visible()->root()->latest()->with(['user', 'replies.user']),
            'media',
        ]);

        $staff = \App\Models\Core\User::role('teacher')->whereHas('institutions', fn($q) => $q->where('id', $grievance->institution_id))->get();

        return Inertia::render('Admin/Grievances/Show', [
            'grievance' => [
                'id' => $grievance->id,
                'reference_code' => $grievance->reference_code,
                'title' => $grievance->title,
                'category' => $grievance->category?->name,
                'category_id' => $grievance->category_id,
                'priority' => $grievance->priority,
                'user_priority' => $grievance->user_priority,
                'admin_priority' => $grievance->admin_priority,
                'status' => $grievance->status,
                'institution' => $grievance->institution?->name,
                'semester' => $grievance->semester?->name,
                'subject' => $grievance->subject?->name,
                'description' => $grievance->description,
                'is_anonymous' => $grievance->is_anonymous,
                'spam_score' => $grievance->spam_score,
                'moderation_status' => $grievance->moderation_status,
                'hidden_at' => $grievance->hidden_at,
                'assigned_to' => $grievance->assignedUser?->id,
                'assigned_to_name' => $grievance->assignedUser?->name,
                'resolution_summary' => $grievance->resolution_summary,
                'resolved_by' => $grievance->resolvedBy?->name,
                'resolved_at' => $grievance->resolved_at?->toISOString(),
                'created_at' => $grievance->created_at->toISOString(),
                'bs_created_at' => BsDateService::toBsString($grievance->created_at, 'datetime_en'),
                'upvotes_count' => $grievance->upvotesCount(),
                'comments_count' => $grievance->commentsCount(),
                'events' => $grievance->events->map(fn($e) => [
                    'id' => $e->id,
                    'type' => $e->type,
                    'description' => $e->description,
                    'is_public' => $e->is_public,
                    'created_at' => $e->created_at->toISOString(),
                    'bs_created_at' => BsDateService::toBsString($e->created_at, 'datetime_en'),
                ]),
                'comments' => $grievance->comments->map(fn($c) => [
                    'id' => $c->id,
                    'body' => $c->body,
                    'author' => $c->authorName(),
                    'is_approved' => $c->is_approved,
                    'created_at' => $c->created_at->toISOString(),
                    'replies' => $c->replies->map(fn($r) => [
                        'id' => $r->id,
                        'body' => $r->body,
                        'author' => $r->authorName(),
                        'created_at' => $r->created_at->toISOString(),
                    ]),
                ]),
                'media' => $grievance->media->map(fn($m) => [
                    'id' => $m->id,
                    'path' => $m->path,
                    'type' => $m->type,
                    'url' => $m->type === 'photo' ? \Illuminate\Support\Facades\Storage::url($m->path) : null,
                ]),
            ],
            'staff' => $staff->map(fn($s) => ['id' => $s->id, 'name' => $s->name]),
        ]);
    }

    public function updateStatus(Request $request, Grievance $grievance)
    {
        $validated = $request->validate([
            'status' => 'required|in:received,in_progress,resolved',
            'resolution_summary' => 'nullable|string|max:2000',
        ]);

        $oldStatus = $grievance->status;
        $grievance->update([
            'status' => $validated['status'],
            'resolved_at' => $validated['status'] === 'resolved' ? now() : null,
            'resolved_by' => $validated['status'] === 'resolved' ? auth()->id() : null,
            'resolution_summary' => $validated['resolution_summary'] ?? $grievance->resolution_summary,
        ]);

        GrievanceEvent::create([
            'grievance_id' => $grievance->id,
            'user_id' => auth()->id(),
            'type' => 'status_changed',
            'description' => "Status changed from {$oldStatus} to {$validated['status']}.",
            'is_public' => true,
        ]);

        return back()->with('success', 'Status updated successfully.');
    }

    public function updatePriority(Request $request, Grievance $grievance)
    {
        $validated = $request->validate([
            'admin_priority' => 'required|in:low,medium,high,critical',
        ]);

        $oldEffective = $grievance->effectivePriority();
        $grievance->update([
            'admin_priority' => $validated['admin_priority'],
            'priority' => $validated['admin_priority'],
            'priority_reviewed_at' => now(),
            'priority_reviewed_by' => auth()->id(),
        ]);

        GrievanceEvent::create([
            'grievance_id' => $grievance->id,
            'user_id' => auth()->id(),
            'type' => 'priority_changed',
            'description' => "Priority changed from {$oldEffective} to {$validated['admin_priority']} by admin.",
            'metadata' => ['from' => $oldEffective, 'to' => $validated['admin_priority']],
            'is_public' => true,
        ]);

        return back()->with('success', 'Priority updated successfully.');
    }

    public function assign(Request $request, Grievance $grievance)
    {
        $validated = $request->validate([
            'assigned_to' => 'required|exists:users,id',
        ]);

        $grievance->update(['assigned_to' => $validated['assigned_to']]);

        $assignedUser = \App\Models\Core\User::find($validated['assigned_to']);

        GrievanceEvent::create([
            'grievance_id' => $grievance->id,
            'user_id' => auth()->id(),
            'type' => 'assigned',
            'description' => "Assigned to {$assignedUser?->name}.",
            'is_public' => true,
        ]);

        return back()->with('success', 'Grievance assigned successfully.');
    }
}