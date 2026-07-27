<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Core\StudentActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserActivityController extends Controller
{
    public function index(Request $request)
    {
        abort_if(!$request->user()->isSuperAdmin(), 403);

        $query = StudentActivityLog::with(['student', 'subject', 'loggable']);

        if ($search = $request->input('search')) {
            $query->whereHas('student', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $activities = $query->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/UserActivity/Index', [
            'activities' => $activities,
            'filters' => [
                'search' => $request->input('search', ''),
            ],
        ]);
    }
}
