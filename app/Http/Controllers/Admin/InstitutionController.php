<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Core\Institution;
use App\Models\Core\User;
use App\Services\AnonymousNameGenerator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class InstitutionController extends Controller
{
    public function index(Request $request)
    {
        abort_if(!$request->user()->isSuperAdmin(), 403);

        $query = Institution::query()->with(['creator', 'users' => function($q) {
            $q->wherePivot('role', 'institution_admin');
        }]);

        if ($search = $request->input('search')) {
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%");
        }

        $institutions = $query->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Institutions/Index', [
            'institutions' => $institutions,
            'filters' => [
                'search' => $request->input('search', ''),
            ],
            'totalInstitutions' => Institution::count(),
        ]);
    }

    public function store(Request $request)
    {
        abort_if(!$request->user()->isSuperAdmin(), 403);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:50',
            'address' => 'required|string|max:255',
            'admin_name' => 'required|string|max:255',
            'admin_email' => 'required|string|email|max:255|unique:users,email',
            'admin_password' => 'required|string|min:8',
        ]);

        DB::transaction(function () use ($validated, $request) {
            // Create Admin User
            $admin = User::create([
                'name' => $validated['admin_name'],
                'email' => $validated['admin_email'],
                'password' => Hash::make($validated['admin_password']),
                'role' => 'institution_admin',
                'anonymous_name' => AnonymousNameGenerator::generate(),
            ]);
            
            $admin->assignRole('institution_admin');

            // Create Institution
            $institution = Institution::create([
                'name' => $validated['name'],
                'type' => $validated['type'],
                'address' => $validated['address'],
                'created_by' => $request->user()->id,
                'is_active' => true,
            ]);

            // Link Admin to Institution
            $institution->users()->attach($admin->id, ['role' => 'institution_admin']);
        });

        return redirect()->route('admin.institutions')->with('success', 'Institution created successfully.');
    }
}
