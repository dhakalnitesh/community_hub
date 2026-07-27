<?php

namespace App\Http\Controllers\Academic;

use App\Http\Requests\StoreAssignmentRequest;
use App\Http\Requests\UpdateAssignmentRequest;
use App\Models\Academic\Assignment;
use App\Models\Academic\Subject;
use App\Events\AssignmentCreated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Http\Controllers\Controller;

class AssignmentController extends Controller
{
    public function index(Request $request)
    {
        $query = Assignment::with(['subject.semester.institution', 'teacher']);

        $user = Auth::user();
        if ($user->isTeacher()) {
            $subjectIds = $user->taughtSubjects()->pluck('subject_id');
            $query->whereIn('subject_id', $subjectIds);
        } elseif ($user->isStudent()) {
            $semesterIds = $user->enrolledSemesters()->pluck('semesters.id');
            $subjectIds = Subject::whereIn('semester_id', $semesterIds)->pluck('id');
            $query->whereIn('subject_id', $subjectIds);
        } elseif ($user->isInstitutionAdmin()) {
            $institutionIds = $user->institutions()->pluck('institutions.id');
            $semesterIds = \App\Models\Academic\Semester::whereIn('institution_id', $institutionIds)->pluck('id');
            $subjectIds = Subject::whereIn('semester_id', $semesterIds)->pluck('id');
            $query->whereIn('subject_id', $subjectIds);
        }

        $assignments = $query->latest()->paginate(20);

        return inertia('Assignments/Index', [
            'assignments' => $assignments,
        ]);
    }

    public function create()
    {
        $user = Auth::user();

        if ($user->isTeacher()) {
            $subjects = $user->taughtSubjects()->with('semester.institution')->get();
        } elseif ($user->isInstitutionAdmin()) {
            $institutionIds = $user->institutions()->pluck('institutions.id');
            $subjects = Subject::whereHas('semester', function ($q) use ($institutionIds) {
                $q->whereIn('institution_id', $institutionIds);
            })->with('semester.institution')->get();
        } else {
            $subjects = Subject::with('semester.institution')->get();
        }

        return inertia('Assignments/Create', ['subjects' => $subjects]);
    }

    public function store(StoreAssignmentRequest $request)
    {
        $this->authorize('create', Assignment::class);

        $user = Auth::user();

        // Verify teacher is assigned to this subject
        if ($user->isTeacher()) {
            $isAssigned = $user->taughtSubjects()
                ->where('subject_id', $request->subject_id)
                ->exists();

            if (!$isAssigned) {
                abort(403, 'You are not assigned to this subject.');
            }
        }

        $assignment = Assignment::create([
            'subject_id' => $request->subject_id,
            'teacher_id' => $user->id,
            'title' => $request->title,
            'description' => $request->description,
            'max_score' => $request->max_score,
            'due_date' => $request->due_date,
            'allow_late_submission' => $request->boolean('allow_late_submission'),
        ]);

        event(new AssignmentCreated($assignment));

        return redirect()->route('assignments.show', $assignment)
            ->with('success', 'Assignment created successfully.');
    }

    public function show(Assignment $assignment)
    {
        $this->authorize('view', $assignment);

        $assignment->load(['subject.semester.institution', 'teacher']);

        $submission = null;
        $user = Auth::user();
        if ($user->isStudent()) {
            $submission = \App\Models\Academic\Submission::where('assignment_id', $assignment->id)
                ->where('student_id', $user->id)
                ->first();
        }

        return inertia('Assignments/Show', [
            'assignment' => $assignment,
            'submission' => $submission,
        ]);
    }

    public function edit(Assignment $assignment)
    {
        $this->authorize('update', $assignment);

        return inertia('Assignments/Edit', [
            'assignment' => $assignment->load('subject'),
        ]);
    }

    public function update(UpdateAssignmentRequest $request, Assignment $assignment)
    {
        $this->authorize('update', $assignment);

        $user = Auth::user();

        // If subject_id is being changed, verify teacher is assigned to the new subject
        if ($request->has('subject_id') && $request->subject_id != $assignment->subject_id && $user->isTeacher()) {
            $isAssigned = $user->taughtSubjects()
                ->where('subject_id', $request->subject_id)
                ->exists();

            if (!$isAssigned) {
                abort(403, 'You are not assigned to this subject.');
            }
        }

        $assignment->update($request->validated());

        return redirect()->route('assignments.show', $assignment)
            ->with('success', 'Assignment updated.');
    }

    public function destroy(Assignment $assignment)
    {
        $this->authorize('delete', $assignment);

        $assignment->delete();

        return redirect()->route('assignments.index')
            ->with('success', 'Assignment deleted.');
    }
}
