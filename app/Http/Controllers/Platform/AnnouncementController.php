<?php

namespace App\Http\Controllers\Platform;

use App\Http\Requests\StoreAnnouncementRequest;
use App\Http\Requests\UpdateAnnouncementRequest;
use App\Models\Platform\Announcement;
use App\Events\AnnouncementPublished;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Http\Controllers\Controller;

class AnnouncementController extends Controller
{
    public function index(Request $request)
    {
        $announcements = Announcement::forUser(Auth::user())
            ->with(['subject.semester.institution', 'user'])
            ->latest()
            ->paginate(20);

        $subjects = Auth::user()->subjectOptions()
            ->with('semester.institution')
            ->get();

        return inertia('Announcements/Index', [
            'announcements' => $announcements,
            'subjects' => $subjects,
        ]);
    }

    public function store(StoreAnnouncementRequest $request)
    {
        $this->authorize('create', Announcement::class);

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

        $data = $request->validated();
        $data['user_id'] = $user->id;

        $announcement = Announcement::create($data);

        event(new AnnouncementPublished($announcement));

        return redirect()->route('announcements.index')
            ->with('success', 'Announcement created successfully.');
    }

    public function update(UpdateAnnouncementRequest $request, Announcement $announcement)
    {
        $this->authorize('update', $announcement);

        $user = Auth::user();

        // If subject_id is being changed, verify teacher is assigned to the new subject
        if ($request->has('subject_id') && $request->subject_id != $announcement->subject_id && $user->isTeacher()) {
            $isAssigned = $user->taughtSubjects()
                ->where('subject_id', $request->subject_id)
                ->exists();

            if (!$isAssigned) {
                abort(403, 'You are not assigned to this subject.');
            }
        }

        $announcement->update($request->validated());

        return redirect()->route('announcements.index')
            ->with('success', 'Announcement updated.');
    }

    public function destroy(Announcement $announcement)
    {
        $this->authorize('delete', $announcement);

        $announcement->delete();

        return redirect()->route('announcements.index')
            ->with('success', 'Announcement deleted.');
    }
}
