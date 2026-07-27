<?php

namespace App\Http\Controllers\Teacher;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

use App\Http\Controllers\Controller;

class ClassController extends Controller
{
    /**
     * Display the teacher's assigned classes.
     */
    public function index()
    {
        $user = Auth::user();
        
        if (!$user->isTeacher()) {
            return redirect()->route('dashboard');
        }
        
        $subjects = $user->taughtSubjects()->with('semester.institution')->get();
        
        return Inertia::render('Teacher/MyClasses', ['subjects' => $subjects]);
    }
}
