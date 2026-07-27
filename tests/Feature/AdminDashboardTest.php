<?php

namespace Tests\Feature;

use App\Models\Core\Institution;
use App\Models\Academic\Semester;
use App\Models\Academic\Subject;
use App\Models\Core\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminDashboardTest extends TestCase
{
    use RefreshDatabase;

    private User $superAdmin;
    private User $instAdmin;
    private User $teacher;
    private User $student;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolesAndPermissionsSeeder::class);

        $institution = Institution::factory()->create();
        $otherInstitution = Institution::factory()->create();

        $this->superAdmin = User::factory()->superAdmin()->create();
        $this->superAdmin->assignRole('super_admin');

        $this->instAdmin = User::factory()->institutionAdmin()->create();
        $this->instAdmin->assignRole('institution_admin');
        $institution->users()->attach($this->instAdmin->id, ['role' => 'institution_admin']);

        $this->teacher = User::factory()->teacher()->create();
        $this->teacher->assignRole('teacher');

        $this->student = User::factory()->student()->create();
        $this->student->assignRole('student');

        // Create some data in the institution
        Semester::factory()->create(['institution_id' => $institution->id]);
        Subject::factory()->create(['semester_id' => Semester::first()->id]);
    }

    public function test_institution_admin_can_view_admin_dashboard(): void
    {
        $this->actingAs($this->instAdmin)
            ->get(route('admin.dashboard'))
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Index', false)
                ->has('stats')
                ->has('institution')
            );
    }

    public function test_super_admin_can_view_admin_dashboard(): void
    {
        $this->actingAs($this->superAdmin)
            ->get(route('admin.dashboard'))
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Index', false)
                ->has('stats')
            );
    }

    public function test_teacher_cannot_view_admin_dashboard(): void
    {
        $this->actingAs($this->teacher)
            ->get(route('admin.dashboard'))
            ->assertForbidden();
    }

    public function test_student_cannot_view_admin_dashboard(): void
    {
        $this->actingAs($this->student)
            ->get(route('admin.dashboard'))
            ->assertForbidden();
    }

    public function test_guest_cannot_view_admin_dashboard(): void
    {
        $this->get(route('admin.dashboard'))
            ->assertRedirect(route('login'));
    }
}
