<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SuperAdminPageController extends Controller
{
    public function institutionAdmins(Request $request)
    {
        abort_if(!$request->user()->isSuperAdmin(), 403);
        return Inertia::render('Admin/InstitutionAdmins/Index');
    }

    public function analytics(Request $request)
    {
        abort_if(!$request->user()->isSuperAdmin(), 403);
        return Inertia::render('Admin/Analytics/Index');
    }

    public function monitoring(Request $request)
    {
        abort_if(!$request->user()->isSuperAdmin(), 403);
        return Inertia::render('Admin/Monitoring/Index');
    }

    public function roles(Request $request)
    {
        abort_if(!$request->user()->isSuperAdmin(), 403);
        
        $query = \App\Models\Core\User::query();
        
        if ($request->has('search') && $request->search) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }
        
        $users = $query->select('id', 'name', 'email', 'role', 'created_at')
            ->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Roles/Index', [
            'users' => $users,
            'filters' => $request->only('search')
        ]);
    }

    public function updateRole(Request $request, \App\Models\Core\User $user)
    {
        abort_if(!$request->user()->isSuperAdmin(), 403);
        
        $request->validate([
            'role' => 'required|in:super_admin,institution_admin,teacher,student,user'
        ]);

        $user->update(['role' => $request->role]);

        return back()->with('success', 'User role updated successfully.');
    }

    public function reports(Request $request)
    {
        abort_if(!$request->user()->isSuperAdmin(), 403);
        return Inertia::render('Admin/Reports/Index');
    }
}
