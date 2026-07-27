<?php

namespace App\Http\Controllers;

use App\Events\ProjectEndorsed;
use App\Http\Requests\StoreProjectReviewRequest;
use App\Models\StudentProject;
use Illuminate\Http\RedirectResponse;

class ProjectReviewController extends Controller
{
    public function store(StoreProjectReviewRequest $request, StudentProject $project): RedirectResponse
    {
        $review = $project->reviews()->create([
            'user_id' => $request->user()->id,
            'content' => $request->validated('content'),
            'is_endorsed' => $request->boolean('is_endorsed'),
        ]);

        if ($review->is_endorsed) {
            ProjectEndorsed::dispatch($project, $review);
        }

        return back()->with('success', 'Review added successfully!');
    }
}
