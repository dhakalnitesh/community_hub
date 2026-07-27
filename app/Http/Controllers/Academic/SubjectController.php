<?php

namespace App\Http\Controllers\Academic;

use App\Http\Requests\StoreSubjectRequest;
use App\Http\Requests\UpdateSubjectRequest;
use App\Models\Academic\Subject;
use App\Models\Core\User;
use App\Events\TeacherAssigned;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Http\Controllers\Controller;

class SubjectController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', Subject::class);

        $user = Auth::user();
        $query = Subject::with('semester.institution');

        if ($user->isInstitutionAdmin()) {
            $institutionIds = $user->institutions()->pluck('institutions.id');
            $semesterIds = \App\Models\Academic\Semester::whereIn('institution_id', $institutionIds)->pluck('id');
            $query->whereIn('semester_id', $semesterIds);
        }

        $subjects = $query->withCount('teachers')->latest()->paginate(20);

        return inertia('Admin/Subjects/Index', [
            'subjects' => $subjects,
        ]);
    }

    public function create()
    {
        $this->authorize('create', Subject::class);

        $user = Auth::user();
        if ($user->isInstitutionAdmin()) {
            $institutionIds = $user->institutions()->pluck('institutions.id');
            $semesters = \App\Models\Academic\Semester::whereIn('institution_id', $institutionIds)->get();
        } else {
            $semesters = \App\Models\Academic\Semester::all();
        }

        return inertia('Admin/Subjects/Create', [
            'semesters' => $semesters,
        ]);
    }

    public function store(StoreSubjectRequest $request)
    {
        $this->authorize('create', Subject::class);

        $semester = \App\Models\Academic\Semester::findOrFail($request->semester_id);

        // Institution admin can only create subjects in their own institution
        if (Auth::user()->isInstitutionAdmin()) {
            $belongsToInstitution = Auth::user()->institutions()
                ->where('institutions.id', $semester->institution_id)
                ->exists();

            if (!$belongsToInstitution) {
                abort(403, 'This semester does not belong to your institution.');
            }
        }

        Subject::create($request->validated());

        return redirect()->route('admin.subjects.index')
            ->with('success', 'Subject created.');
    }

    public function edit(Subject $subject)
    {
        $this->authorize('update', $subject);

        return inertia('Admin/Subjects/Edit', [
            'subject' => $subject->load('semester.institution'),
            'semesters' => \App\Models\Academic\Semester::with('institution')->get(),
        ]);
    }

    public function update(UpdateSubjectRequest $request, Subject $subject)
    {
        $this->authorize('update', $subject);

        $subject->update($request->validated());

        return redirect()->route('admin.subjects.index')
            ->with('success', 'Subject updated.');
    }

    public function destroy(Subject $subject)
    {
        $this->authorize('delete', $subject);

        $subject->delete();

        return redirect()->route('admin.subjects.index')
            ->with('success', 'Subject deleted.');
    }

    public function assignTeacher(Request $request, Subject $subject)
    {
        $this->authorize('update', $subject);

        $validated = $request->validate([
            'teacher_id' => 'required|integer|exists:users,id',
            'section_id' => 'nullable|integer|exists:sections,id',
        ]);

        $teacher = User::findOrFail($validated['teacher_id']);
        if (!$teacher->isTeacher()) {
            return back()->withErrors(['teacher_id' => 'The selected user is not a teacher.']);
        }

        $subject->teachers()->syncWithoutDetaching([
            $teacher->id => ['section_id' => $validated['section_id'] ?? null],
        ]);

        event(new TeacherAssigned($subject, $teacher));

        return redirect()->route('admin.subjects.index')
            ->with('success', 'Teacher assigned to subject.');
    }

    public function removeTeacher(Subject $subject, User $teacher)
    {
        $this->authorize('update', $subject);

        $subject->teachers()->detach($teacher->id);

        return redirect()->route('admin.subjects.index')
            ->with('success', 'Teacher removed from subject.');
    }
}
