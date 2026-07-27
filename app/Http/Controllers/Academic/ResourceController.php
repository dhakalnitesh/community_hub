<?php

namespace App\Http\Controllers\Academic;

use App\Http\Requests\StoreResourceRequest;
use App\Http\Requests\UpdateResourceRequest;
use App\Models\Academic\Resource;
use App\Models\Academic\Subject;
use App\Events\ResourceUploaded;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Http\Controllers\Controller;

class ResourceController extends Controller
{
    public function index(Request $request)
    {
        $resources = Resource::forUser(Auth::user())
            ->with(['subject.semester.institution', 'teacher'])
            ->latest()
            ->paginate(20);

        return inertia('Resources/Index', [
            'resources' => $resources,
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

        return inertia('Resources/Create', ['subjects' => $subjects]);
    }

    public function store(StoreResourceRequest $request)
    {
        $this->authorize('create', Resource::class);

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
        $data['teacher_id'] = $user->id;

        if ($request->hasFile('attachment')) {
            $path = $request->file('attachment')->store('resources', 'public');
            $data['file_url'] = '/storage/' . $path;
        }

        $resource = Resource::create($data);

        event(new ResourceUploaded($resource));

        return redirect()->route('resources.index')
            ->with('success', 'Resource created successfully.');
    }

    public function edit(Resource $resource)
    {
        $this->authorize('update', $resource);

        return inertia('Resources/Edit', [
            'resource' => $resource->load('subject'),
        ]);
    }

    public function update(UpdateResourceRequest $request, Resource $resource)
    {
        $this->authorize('update', $resource);

        $user = Auth::user();

        // If subject_id is being changed, verify teacher is assigned to the new subject
        if ($request->has('subject_id') && $request->subject_id != $resource->subject_id && $user->isTeacher()) {
            $isAssigned = $user->taughtSubjects()
                ->where('subject_id', $request->subject_id)
                ->exists();

            if (!$isAssigned) {
                abort(403, 'You are not assigned to this subject.');
            }
        }

        $data = $request->validated();

        if ($request->hasFile('attachment')) {
            $path = $request->file('attachment')->store('resources', 'public');
            $data['file_url'] = '/storage/' . $path;
        }

        $resource->update($data);

        return redirect()->route('resources.index')
            ->with('success', 'Resource updated.');
    }

    public function destroy(Resource $resource)
    {
        $this->authorize('delete', $resource);

        $resource->delete();

        return redirect()->route('resources.index')
            ->with('success', 'Resource deleted.');
    }
}
