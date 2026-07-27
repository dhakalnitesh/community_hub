<?php

namespace App\Http\Controllers\Grievance;

use App\Models\Grievance\Grievance;
use App\Models\Grievance\GrievanceCategory;
use App\Services\BsDateService;
use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Http\Controllers\Controller;

class GrievanceFeedController extends Controller
{
    public function index(Request $request)
    {
        $query = Grievance::with(['institution', 'category'])
            ->visible()
            ->whereNull('deleted_at');

        if ($user = auth()->user()) {
            if ($user->isTeacher()) {
                $subjectIds = $user->taughtSubjects()->pluck('subjects.id');
                $query->whereIn('subject_id', $subjectIds);
            } elseif ($user->isStudent()) {
                $semesterIds = $user->enrolledSemesters()->pluck('semesters.id');
                $subjectIds = \App\Models\Academic\Subject::whereIn('semester_id', $semesterIds)->pluck('id');
                $query->whereIn('subject_id', $subjectIds);
            } elseif ($user->isInstitutionAdmin()) {
                $institutionIds = $user->institutions()->pluck('institutions.id');
                $query->whereIn('institution_id', $institutionIds);
            }
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('institution_id')) {
            $query->where('institution_id', $request->institution_id);
        }

        $sort = $request->get('sort', 'latest');
        $query->when($sort === 'oldest', fn($q) => $q->oldest())
            ->when($sort === 'latest', fn($q) => $q->latest());

        $perPage = min((int) $request->get('per_page', 20), 50);

        $userId = auth()->id();
        $sessionId = $userId ? null : session()->getId();

        $query->withCount(['comments']);
        $query->with(['upvotes' => fn($q) => $q->with('user:id,name')->latest()->limit(10)]);

        $grievances = $query->paginate($perPage)->through(function ($g) use ($userId, $sessionId) {
            $namedUpvoters = $g->upvotes->filter(fn($u) => $u->user_id !== null)
                ->pluck('user.name')->unique()->take(2)->values();
            $anonCount = $g->upvotes->filter(fn($u) => $u->user_id === null)->count();
            $totalUpvotes = $g->upvotes->count();

            $socialProof = null;
            if ($totalUpvotes > 0) {
                if ($namedUpvoters->count() > 0) {
                    $others = $totalUpvotes - $namedUpvoters->count();
                    $socialProof = $namedUpvoters->implode(', ') . ($others > 0 ? " + {$others} others" : '');
                } else {
                    $socialProof = $totalUpvotes . ' people';
                }
            }

            return [
                'id' => $g->id,
                'reference_code' => $g->reference_code,
                'title' => $g->title,
                'category' => $g->category?->name,
                'priority' => $g->priority,
                'status' => $g->status,
                'description' => $g->description,
                'institution' => $g->institution?->name,
                'is_anonymous' => $g->is_anonymous,
                'created_at' => $g->created_at->toISOString(),
                'bs_date' => BsDateService::toBsString($g->created_at, 'datetime'),
                'bs_date_short' => BsDateService::toBsString($g->created_at, 'short'),
                'upvotes_count' => $totalUpvotes,
                'comments_count' => $g->comments_count,
                'has_upvoted' => $g->isUpvotedBy($userId, $sessionId),
                'social_proof' => $socialProof,
            ];
        });

        $categories = GrievanceCategory::active()->sorted()->get(['id', 'name']);
        
        $institutions = \App\Models\Core\Institution::where('is_active', true)->orderBy('name')->get();
        $semesters = collect();
        $subjects = collect();

        if ($user && $user->isStudent()) {
            $semesterIds = $user->enrolledSemesters()->pluck('semesters.id');
            $semesters = \App\Models\Academic\Semester::whereIn('id', $semesterIds)->get();
            $subjects = \App\Models\Academic\Subject::whereIn('semester_id', $semesterIds)->get();
        }

        return Inertia::render('Grievances/Feed', [
            'grievances' => $grievances,
            'filters' => $request->only(['category_id', 'status', 'institution_id', 'sort']),
            'categories' => $categories,
            'institutions' => $institutions,
            'semesters' => $semesters,
            'subjects' => $subjects,
            'priorities' => [
                'low' => 'Low',
                'medium' => 'Medium',
                'high' => 'High',
                'critical' => 'Critical',
            ],
        ]);
    }
}