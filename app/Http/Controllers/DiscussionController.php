<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDiscussionRequest;
use App\Http\Requests\UpdateDiscussionRequest;
use App\Models\Discussion;
use App\Models\Subject;
use App\Models\StudentActivityLog;
use App\Events\QuestionPosted;
use App\Services\AnonymousNameGenerator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class DiscussionController extends Controller
{
    public function index(Request $request)
    {
        $query = Discussion::with(['user', 'votes'])
            ->withCount(['answers', 'votes as upvotes_count' => function ($q) {
                $q->where('type', 'upvote');
            }, 'votes as downvotes_count' => function ($q) {
                $q->where('type', 'downvote');
            }]);

        if ($request->filled('subject_id')) {
            $query->where('discussionable_type', 'subject')
                  ->where('discussionable_id', $request->subject_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $query->where(function ($q) {
            $q->whereHas('discussionable')
              ->orWhereNull('discussionable_type')
              ->orWhere('discussionable_type', 'general');
        });

        $user = Auth::user();
        if ($user->isSuperAdmin()) {
            // No additional restrictions
        } elseif ($user->isTeacher()) {
            $subjectIds = $user->taughtSubjects()->pluck('subjects.id');
            $query->where(function ($q) use ($subjectIds) {
                $q->where('discussionable_type', 'subject')
                  ->whereIn('discussionable_id', $subjectIds);
            });
        } elseif ($user->isStudent()) {
            $semesterIds = $user->enrolledSemesters()->pluck('semesters.id');
            $subjectIds = Subject::whereIn('semester_id', $semesterIds)->pluck('id');
            $query->where(function ($q) use ($subjectIds) {
                $q->where('discussionable_type', 'subject')
                  ->whereIn('discussionable_id', $subjectIds);
            });
        } elseif ($user->isInstitutionAdmin()) {
            $institutionIds = $user->institutions()->pluck('institutions.id');
            $semesterIds = \App\Models\Semester::whereIn('institution_id', $institutionIds)->pluck('id');
            $subjectIds = Subject::whereIn('semester_id', $semesterIds)->pluck('id');
            $query->where(function ($q) use ($subjectIds) {
                $q->where('discussionable_type', 'subject')
                  ->whereIn('discussionable_id', $subjectIds);
            });
        }

        $discussions = $query->latest()->paginate(20);

        // Fetch subjects for the "Ask Question" modal dropdown
        if ($user->isTeacher()) {
            $subjects = $user->taughtSubjects()->with('semester.institution')->get();
        } elseif ($user->isStudent()) {
            $semesterIds = $user->enrolledSemesters()->pluck('semesters.id');
            $subjects = Subject::whereIn('semester_id', $semesterIds)
                ->with('semester.institution')
                ->get();
        } elseif ($user->isInstitutionAdmin()) {
            $institutionIds = $user->institutions()->pluck('institutions.id');
            $subjects = Subject::whereHas('semester', function ($q) use ($institutionIds) {
                $q->whereIn('institution_id', $institutionIds);
            })->with('semester.institution')->get();
        } else {
            $subjects = Subject::with('semester.institution')->get();
        }

        return inertia('Questions/Index', [
            'discussions' => $discussions,
            'filters' => $request->only(['subject_id', 'status']),
            'subjects' => $subjects,
        ]);
    }

    public function create()
    {
        $user = Auth::user();

        if ($user->isTeacher()) {
            $subjects = $user->taughtSubjects()->with('semester.institution')->get();
        } elseif ($user->isStudent()) {
            $semesterIds = $user->enrolledSemesters()->pluck('semesters.id');
            $subjects = Subject::whereIn('semester_id', $semesterIds)
                ->with('semester.institution')
                ->get();
        } elseif ($user->isInstitutionAdmin()) {
            $institutionIds = $user->institutions()->pluck('institutions.id');
            $subjects = Subject::whereHas('semester', function ($q) use ($institutionIds) {
                $q->whereIn('institution_id', $institutionIds);
            })->with('semester.institution')->get();
        } else {
            $subjects = Subject::with('semester.institution')->get();
        }

        return inertia('Questions/Create', ['subjects' => $subjects]);
    }

    public function store(StoreDiscussionRequest $request)
    {
        $this->authorize('create', Discussion::class);

        $morphMap = \Illuminate\Database\Eloquent\Relations\Relation::morphMap();
        $modelClass = $morphMap[$request->discussionable_type] ?? null;
        if (!$modelClass) {
            abort(400, 'Invalid discussionable type.');
        }
        $discussionable = $modelClass::findOrFail($request->discussionable_id);

        $dummyDiscussion = new Discussion([
            'discussionable_id' => $request->discussionable_id,
            'discussionable_type' => $request->discussionable_type,
        ]);
        $dummyDiscussion->setRelation('discussionable', $discussionable);
        $this->authorize('view', $dummyDiscussion);

        $trackingToken = 'QA-' . strtoupper(Str::random(6));

        $discussion = Discussion::create([
            'user_id' => Auth::id(),
            'discussionable_id' => $request->discussionable_id,
            'discussionable_type' => $request->discussionable_type,
            'title' => $request->title,
            'body' => $request->body,
            'category' => $request->category,
            'is_anonymous' => $request->boolean('is_anonymous'),
            'status' => 'open',
            'tracking_token' => $trackingToken,
        ]);

        StudentActivityLog::create([
            'student_id' => Auth::id(),
            'subject_id' => $request->discussionable_type === 'subject' ? $request->discussionable_id : null,
            'action' => 'created_discussion',
            'loggable_id' => $discussion->id,
            'loggable_type' => Discussion::class,
        ]);

        event(new QuestionPosted($discussion));

        return redirect()->route('questions.index')
            ->with('success', 'Your question has been posted.')
            ->with('tracking_token', $trackingToken);
    }

    public function track(Request $request)
    {
        $request->validate(['token' => 'required|string']);
        $token = strtoupper(trim($request->token));
        
        $discussion = Discussion::where('tracking_token', $token)->first();
        
        if (!$discussion) {
            return back()->with('error', 'No question found with that tracking token.');
        }
        
        return redirect()->route('questions.show', $discussion);
    }

    public function show(Discussion $discussion)
    {
        $this->authorize('view', $discussion);

        $discussion->load([
            'user',
            'discussionable',
            'answers' => function ($q) {
                $q->with(['user', 'votes'])->withCount([
                    'votes as upvotes_count' => fn($q) => $q->where('type', 'upvote'),
                    'votes as downvotes_count' => fn($q) => $q->where('type', 'downvote'),
                ])->latest();
            },
            'votes',
        ])->loadCount([
            'answers',
            'votes as upvotes_count' => fn($q) => $q->where('type', 'upvote'),
            'votes as downvotes_count' => fn($q) => $q->where('type', 'downvote'),
        ]);

        $user = Auth::user();
        $discussion->answers->transform(function ($answer) use ($user) {
            $answer->permissions = [
                'update' => $user->can('update', $answer),
                'delete' => $user->can('delete', $answer),
                'endorse' => $user->can('endorse', $answer),
            ];
            return $answer;
        });

        return inertia('Questions/Show', [
            'discussion' => $discussion,
            'permissions' => [
                'update' => $user->can('update', $discussion),
                'delete' => $user->can('delete', $discussion),
            ],
        ]);
    }

    public function edit(Discussion $discussion)
    {
        $this->authorize('update', $discussion);

        return inertia('Questions/Edit', [
            'discussion' => $discussion->load('discussionable'),
        ]);
    }

    public function update(UpdateDiscussionRequest $request, Discussion $discussion)
    {
        $this->authorize('update', $discussion);

        $discussion->update($request->validated());

        return redirect()->route('questions.show', $discussion)
            ->with('success', 'Question updated.');
    }

    public function destroy(Discussion $discussion)
    {
        $this->authorize('delete', $discussion);

        $discussion->delete();

        return redirect()->route('questions.index')
            ->with('success', 'Question deleted.');
    }
}
