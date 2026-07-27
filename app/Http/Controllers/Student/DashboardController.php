<?php

namespace App\Http\Controllers\Student;

use App\Models\Community\Discussion;
use App\Models\Community\DiscussionAnswer;
use App\Models\Grievance\Grievance;
use App\Models\Academic\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

use App\Http\Controllers\Controller;

class DashboardController extends Controller
{
    /**
     * Display the student dashboard with overview statistics.
     */
    public function index()
    {
        $user = Auth::user();
        
        if (!$user->isStudent()) {
            return redirect()->route('dashboard');
        }

        $semesterIds = $user->enrolledSemesters()->pluck('semesters.id');
        $subjectIds = Subject::whereIn('semester_id', $semesterIds)->pluck('id');
        
        $stats = [
            'subjects' => count($subjectIds),
            'questions' => Discussion::where('discussionable_type', 'subject')
                ->whereIn('discussionable_id', $subjectIds)
                ->where('user_id', $user->id)
                ->count(),
            'answers' => DiscussionAnswer::where('user_id', $user->id)->count(),
            'grievances' => Grievance::where('user_id', $user->id)->visible()->count(),
            'open_grievances' => Grievance::where('user_id', $user->id)->visible()->where('status', '!=', 'resolved')->count(),
            'resolved_grievances' => Grievance::where('user_id', $user->id)->visible()->where('status', 'resolved')->count(),
            'critical_grievances' => Grievance::where('user_id', $user->id)->visible()->where('priority', 'critical')->count(),
        ];

        return Inertia::render('Student/Dashboard', ['stats' => $stats]);
    }

    /**
     * Display the student's enrolled subjects.
     */
    public function mySubjects()
    {
        $user = Auth::user();
        
        if (!$user->isStudent()) {
            return redirect()->route('dashboard');
        }
        
        $semesterIds = $user->enrolledSemesters()->pluck('semesters.id');
        $subjects = Subject::whereIn('semester_id', $semesterIds)
            ->with('semester.institution', 'teachers')
            ->get();
            
        return Inertia::render('Student/MySubject', ['subjects' => $subjects]);
    }
}
