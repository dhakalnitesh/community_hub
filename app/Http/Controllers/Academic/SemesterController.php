<?php

namespace App\Http\Controllers\Academic;

use App\Http\Requests\StoreSemesterRequest;
use App\Http\Requests\UpdateSemesterRequest;
use App\Models\Academic\Semester;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Http\Controllers\Controller;

class SemesterController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', Semester::class);

        $user = Auth::user();
        $query = Semester::with('institution');

        if ($user->isInstitutionAdmin()) {
            $institutionIds = $user->institutions()->pluck('institutions.id');
            $query->whereIn('institution_id', $institutionIds);
        }

        $semesters = $query->latest()->paginate(20);

        return inertia('Admin/Semesters/Index', [
            'semesters' => $semesters,
        ]);
    }

    public function create()
    {
        $this->authorize('create', Semester::class);

        return inertia('Admin/Semesters/Create');
    }

    public function store(StoreSemesterRequest $request)
    {
        $this->authorize('create', Semester::class);

        $user = Auth::user();
        $data = $request->validated();

        if ($user->isInstitutionAdmin()) {
            $institutionId = $user->institutions()->first()?->id;
            if (!$institutionId) {
                abort(403, 'You are not associated with any institution.');
            }
            $data['institution_id'] = $institutionId;
        } elseif ($user->isSuperAdmin()) {
            $data['institution_id'] = $request->institution_id;
        }

        Semester::create($data);

        return redirect()->route('admin.semesters.index')
            ->with('success', 'Semester created.');
    }

    public function edit(Semester $semester)
    {
        $this->authorize('update', $semester);

        return inertia('Admin/Semesters/Edit', [
            'semester' => $semester->load('institution'),
        ]);
    }

    public function update(UpdateSemesterRequest $request, Semester $semester)
    {
        $this->authorize('update', $semester);

        $semester->update($request->validated());

        return redirect()->route('admin.semesters.index')
            ->with('success', 'Semester updated.');
    }

    public function destroy(Semester $semester)
    {
        $this->authorize('delete', $semester);

        $semester->delete();

        return redirect()->route('admin.semesters.index')
            ->with('success', 'Semester deleted.');
    }
}
