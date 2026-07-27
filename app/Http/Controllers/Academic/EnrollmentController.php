<?php

namespace App\Http\Controllers\Academic;

use App\Models\Academic\Semester;
use App\Models\Core\User;
use App\Events\StudentEnrolled;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Http\Controllers\Controller;

class EnrollmentController extends Controller
{
    public function enroll(Request $request)
    {
        $request->validate([
            'invite_code' => 'required|string|max:20',
        ]);

        $semester = Semester::where('invite_code', $request->invite_code)
            ->where('is_active', true)
            ->first();

        if (!$semester) {
            return back()->withErrors([
                'invite_code' => 'Invalid invite code.',
            ]);
        }

        $user = Auth::user();

        $alreadyEnrolled = $semester->students()
            ->where('student_id', $user->id)
            ->exists();

        if ($alreadyEnrolled) {
            return back()->withErrors([
                'invite_code' => 'You are already enrolled in this semester.',
            ]);
        }

        $semester->students()->attach($user->id, [
            'status' => 'active',
            'joined_at' => now(),
        ]);

        event(new StudentEnrolled($semester, $user));

        return redirect()->route('dashboard')
            ->with('success', 'Successfully enrolled in ' . $semester->name);
    }

    public function index()
    {
        $user = Auth::user();

        if (!$user->isInstitutionAdmin() && !$user->isSuperAdmin()) {
            abort(403);
        }

        $query = \App\Models\Academic\SemesterStudent::with(['semester.institution', 'student']);

        if ($user->isInstitutionAdmin()) {
            $institutionIds = $user->institutions()->pluck('institutions.id');
            $semesterIds = Semester::whereIn('institution_id', $institutionIds)->pluck('id');
            $query->whereIn('semester_id', $semesterIds);
        }

        $enrollments = $query->latest()->paginate(20);

        return inertia('Admin/Enrollments/Index', [
            'enrollments' => $enrollments,
        ]);
    }

    public function remove(Semester $semester, User $student)
    {
        $user = Auth::user();

        if (!$user->isSuperAdmin()) {
            if (!$user->isInstitutionAdmin()) {
                abort(403);
            }

            $belongsToInstitution = $user->institutions()
                ->where('institutions.id', $semester->institution_id)
                ->exists();

            if (!$belongsToInstitution) {
                abort(403);
            }
        }

        $semester->students()->detach($student->id);

        return redirect()->route('admin.enrollments.index')
            ->with('success', 'Student removed from semester.');
    }
}
