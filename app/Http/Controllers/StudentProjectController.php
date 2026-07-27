<?php

namespace App\Http\Controllers;

use App\Models\StudentProject;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentProjectController extends Controller
{
    public function index(Request $request)
    {
        // For the demo, we show all published projects in the current user's institution
        $institutionId = $request->user()->institutions()->first()?->id;

        $projects = StudentProject::with(['user:id,name', 'reviews.user:id,name'])
            ->when($institutionId, fn($q) => $q->where('institution_id', $institutionId))
            ->where('status', 'published')
            ->latest()
            ->get();

        return Inertia::render('Projects/Showcase', [
            'projects' => $projects,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'tech_stack' => ['required', 'string', 'max:255'],
            'github_url' => ['nullable', 'url', 'max:255'],
            'live_demo_url' => ['nullable', 'url', 'max:255'],
        ]);

        $this->authorize('create', StudentProject::class);

        $institutionId = $request->user()->institutions()->first()?->id;
        abort_if(!$institutionId, 403, 'You must be associated with an institution to create a project.');

        StudentProject::create([
            ...$validated,
            'user_id' => $request->user()->id,
            'institution_id' => $institutionId,
            'status' => 'published', // Auto-publish for hackathon demo speed
        ]);

        return redirect()->route('projects.index')->with('success', 'Project added to the showcase!');
    }
}