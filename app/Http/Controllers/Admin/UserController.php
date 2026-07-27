<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Core\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a paginated list of users for platform admin.
     */
    public function index(Request $request)
    {
        abort_if(!$request->user()->isSuperAdmin(), 403);

        $query = User::query();

        // Search by name or email
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filter by role
        if ($role = $request->input('role')) {
            $query->where('role', $role);
        }

        $users = $query->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => [
                'search' => $request->input('search', ''),
                'role' => $request->input('role', ''),
            ],
            'totalUsers' => User::count(),
            'roleCounts' => [
                'super_admin' => User::where('role', 'super_admin')->count(),
                'institution_admin' => User::where('role', 'institution_admin')->count(),
                'teacher' => User::where('role', 'teacher')->count(),
                'student' => User::where('role', 'student')->count(),
            ],
        ]);
    }
}
