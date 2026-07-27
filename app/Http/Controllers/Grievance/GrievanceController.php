<?php

namespace App\Http\Controllers\Grievance;

use App\Models\Grievance\Grievance;
use App\Models\Grievance\GrievanceCategory;
use App\Models\Grievance\GrievanceEvent;
use App\Models\Core\Institution;
use App\Models\Academic\Semester;
use App\Models\Academic\Subject;
use App\Services\BsDateService;
use App\Services\GrievanceService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Resources\GrievanceResource;

use App\Http\Controllers\Controller;

class GrievanceController extends Controller
{
    public function create(Request $request)
    {
        $institutions = Institution::where('is_active', true)->orderBy('name')->get();
        $categories = GrievanceCategory::active()->sorted()->get(['id', 'name']);

        $user = auth()->user();
        $semesters = collect();
        $subjects = collect();

        if ($user && $user->isStudent()) {
            $semesterIds = $user->enrolledSemesters()->pluck('semesters.id');
            $semesters = Semester::whereIn('id', $semesterIds)->get();
            $subjects = Subject::whereIn('semester_id', $semesterIds)->get();
        }

        return Inertia::render('Grievances/Submit', [
            'institutions' => $institutions,
            'categories' => $categories,
            'semesters' => $semesters,
            'subjects' => $subjects,
            'priorities' => [
                'low' => 'Low',
                'medium' => 'Medium',
                'high' => 'High',
                'critical' => 'Critical',
            ],
        ]);
    }

    public function store(Request $request, GrievanceService $grievanceService)
    {
        $result = $grievanceService->createGrievance($request);

        if (!empty($result['honeypot'])) {
            return redirect()->route('dashboard');
        }

        if (!empty($result['captcha_error'])) {
            return back()->withErrors(['captcha' => 'Security check failed. Please try again.']);
        }

        if (!empty($result['merged'])) {
            return redirect()->route('grievances.show-reference', [
                'reference_code' => $result['merged_into']->reference_code,
            ])->with('info', 'Your grievance was similar to an existing report. It has been combined for better tracking.');
        }

        $grievance = $result['grievance'];
        $duplicates = $result['duplicates'] ?? [];

        $redirect = redirect()->route('grievances.show-reference', [
            'reference_code' => $grievance->reference_code,
        ]);

        if (!empty($duplicates)) {
            $redirect->with('warning', 'Similar grievances found: ' . collect($duplicates)->pluck('reference_code')->implode(', '));
        }

        return $redirect;
    }

    public function showReference($referenceCode)
    {
        $grievance = Grievance::where('reference_code', $referenceCode)
            ->with([
                'institution', 'semester', 'subject', 'category',
                'assignedUser', 'resolvedBy',
                'events' => fn($q) => $q->public()->latest()->limit(20),
                'comments' => fn($q) => $q->visible()->approved()->public()->root()->latest()->with(['user', 'replies.user']),
                'media',
            ])
            ->first();

        if (!$grievance) {
            return redirect()->route('grievances.track')->with('error', 'No grievance found with reference code: ' . $referenceCode);
        }

        if ($grievance->status === 'merged' && $grievance->duplicate_of_id) {
            $parent = Grievance::find($grievance->duplicate_of_id);
            if ($parent) {
                return redirect()->route('grievances.show-reference', ['reference_code' => $parent->reference_code])
                    ->with('info', 'This grievance was combined with ' . $parent->reference_code);
            }
        }

        return Inertia::render('Grievances/Show', [
            'grievance' => new GrievanceResource($grievance),
        ]);
    }

    public function trackStatus(Request $request)
    {
        $grievance = null;
        $error = null;

        if ($request->filled('code')) {
            $grievance = Grievance::with(['institution', 'assignedUser', 'resolvedBy', 'events' => fn($q) => $q->public()->latest()->limit(20)])
                ->where('reference_code', strtoupper($request->code))
                ->first();

            if (!$grievance) {
                $error = 'No grievance found with this reference code. Please check and try again.';
            }
        }

        return Inertia::render('Grievances/Track', [
            'grievance' => $grievance ? new GrievanceResource($grievance) : null,
            'error' => $error,
        ]);
    }
}