<?php

namespace App\Http\Controllers\Academic;

use App\Http\Requests\StoreSubmissionRequest;
use App\Models\Academic\Assignment;
use App\Models\Academic\Submission;
use App\Events\AssignmentGraded;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Http\Controllers\Controller;

class SubmissionController extends Controller
{
    public function show(Submission $submission)
    {
        $this->authorize('view', $submission);

        $submission->load(['assignment.subject.semester.institution', 'student']);

        return inertia('Assignments/Submission', [
            'submission' => $submission,
        ]);
    }

    public function store(StoreSubmissionRequest $request, Assignment $assignment)
    {
        $this->authorize('create', Submission::class);

        $user = Auth::user();

        // Verify student is enrolled in the subject
        $subject = $assignment->subject;
        $isEnrolled = $user->enrolledSemesters()
            ->where('semester_id', $subject->semester_id)
            ->exists();

        if (!$isEnrolled) {
            abort(403, 'You are not enrolled in this subject.');
        }

        // Check existing submission (unique constraint)
        $existing = Submission::where('assignment_id', $assignment->id)
            ->where('student_id', $user->id)
            ->first();

        if ($existing) {
            abort(403, 'You have already submitted to this assignment.');
        }

        // Late submission check
        if ($assignment->due_date && now()->gt($assignment->due_date)) {
            if (!$assignment->allow_late_submission) {
                abort(403, 'Late submissions are not allowed for this assignment.');
            }
        }

        $isLate = $assignment->due_date && now()->gt($assignment->due_date);

        $fileUrls = [];
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('submissions', 'public');
                $fileUrls[] = '/storage/' . $path;
            }
        }

        $submission = Submission::create([
            'assignment_id' => $assignment->id,
            'student_id' => $user->id,
            'content' => $request->content,
            'file_url' => count($fileUrls) > 0 ? json_encode($fileUrls) : null,
            'submitted_at' => now(),
            'is_late' => $isLate,
            'status' => 'submitted',
        ]);

        return redirect()->route('assignments.show', $assignment)
            ->with('success', 'Submission received.');
    }

    public function update(Request $request, Submission $submission)
    {
        $this->authorize('update', $submission);

        $maxScore = $submission->assignment->max_score ?? 999999;

        $validated = $request->validate([
            'score' => 'required|integer|min:0|max:' . $maxScore,
            'feedback' => 'nullable|string',
        ]);

        $updated = $submission->update([
            'score' => (int) $validated['score'],
            'feedback' => $validated['feedback'],
            'status' => 'graded',
        ]);

        if (!$updated) {
            return back()->with('error', 'Failed to update submission.');
        }

        event(new AssignmentGraded($submission));

        return redirect()->route('assignments.show', $submission->assignment)
            ->with('success', 'Submission graded.');
    }
}
