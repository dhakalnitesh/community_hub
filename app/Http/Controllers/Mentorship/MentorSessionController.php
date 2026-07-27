<?php

namespace App\Http\Controllers\Mentorship;

use App\Models\Mentorship\MentorSession;
use App\Models\Core\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Http\Controllers\Controller;

class MentorSessionController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', MentorSession::class);

        // Show open requests and the current user's mentoring activity
        $openRequests = MentorSession::with('discussion:id,title,anonymous_name')
            ->where('status', 'requested')
            ->latest()
            ->get();

        $topMentors = User::where('mentor_badges_count', '>', 0)
            ->orderByDesc('mentor_badges_count')
            ->take(5)
            ->get(['id', 'name', 'mentor_badges_count']);

        return Inertia::render('Mentorship/Board', [
            'openRequests' => $openRequests,
            'topMentors' => $topMentors,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'discussion_id' => 'required|exists:discussions,id',
            'topic' => 'required|string|max:255',
        ]);

        // Ensure not already requested
        if (MentorSession::where('discussion_id', $validated['discussion_id'])->exists()) {
            return back()->withErrors(['message' => 'A mentor has already been requested for this discussion.']);
        }

        MentorSession::create([
            'discussion_id' => $validated['discussion_id'],
            'mentee_id' => $request->user()->id,
            'topic' => $validated['topic'],
            'status' => 'requested',
        ]);

        return back()->with('success', 'Mentor request submitted successfully!');
    }

    public function accept(Request $request, MentorSession $mentorSession)
    {
        $this->authorize('accept', $mentorSession);

        // A senior student accepts the request
        $mentorSession->update([
            'mentor_id' => $request->user()->id,
            'status' => 'accepted',
        ]);

        return back()->with('success', 'You have accepted this mentor session. Please contact the student.');
    }

    public function complete(Request $request, MentorSession $mentorSession)
    {
        $this->authorize('complete', $mentorSession);

        // For hackathon speed, allowing the mentor to auto-complete and earn the badge
        $mentorSession->update([
            'status' => 'completed',
            'mentor_notes' => $request->input('notes', 'Session completed successfully.'),
        ]);

        // Award the badge
        $mentor = User::find($mentorSession->mentor_id);
        $mentor->increment('mentor_badges_count');

        return back()->with('success', 'Session completed! You earned a Campus Mentor Badge.');
    }
}