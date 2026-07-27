<?php

namespace Tests\Feature;

use App\Models\Core\Institution;
use App\Models\Academic\Semester;
use App\Models\Core\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SemesterManagementTest extends TestCase
{
    use RefreshDatabase;

    private User $superAdmin;
    private User $instAdmin;
    private User $teacher;
    private User $student;
    private Institution $institution;
    private Institution $otherInstitution;
    private Semester $semester;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolesAndPermissionsSeeder::class);

        $this->institution = Institution::factory()->create();
        $this->otherInstitution = Institution::factory()->create();

        $this->superAdmin = User::factory()->superAdmin()->create();
        $this->superAdmin->assignRole('super_admin');

        $this->instAdmin = User::factory()->institutionAdmin()->create();
        $this->instAdmin->assignRole('institution_admin');
        $this->institution->users()->attach($this->instAdmin->id, ['role' => 'institution_admin']);

        $this->teacher = User::factory()->teacher()->create();
        $this->teacher->assignRole('teacher');

        $this->student = User::factory()->student()->create();
        $this->student->assignRole('student');

        $this->semester = Semester::factory()->create(['institution_id' => $this->institution->id]);
    }

    // === Auth ===

    public function test_guest_cannot_list_semesters(): void
    {
        $this->get(route('admin.semesters.index'))->assertRedirect(route('login'));
    }

    public function test_guest_cannot_create_semester(): void
    {
        $this->post(route('admin.semesters.store'), [
            'name' => 'BCA 5th Semester',
            'invite_code' => 'BCA5XYZ',
        ])->assertRedirect(route('login'));
    }

    // === Access ===

    public function test_institution_admin_can_list_semesters(): void
    {
        $this->actingAs($this->instAdmin)
            ->get(route('admin.semesters.index'))
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Semesters/Index', false)
                ->has('semesters.data')
            );
    }

    public function test_institution_admin_only_sees_own_semesters(): void
    {
        Semester::factory()->create(['institution_id' => $this->otherInstitution->id]);

        $response = $this->actingAs($this->instAdmin)
            ->get(route('admin.semesters.index'));

        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Semesters/Index', false)
            ->has('semesters.data', 1)
        );
    }

    public function test_teacher_cannot_manage_semesters(): void
    {
        $this->actingAs($this->teacher)
            ->get(route('admin.semesters.index'))
            ->assertForbidden();
    }

    public function test_student_cannot_manage_semesters(): void
    {
        $this->actingAs($this->student)
            ->get(route('admin.semesters.index'))
            ->assertForbidden();
    }

    // === CRUD ===

    public function test_institution_admin_can_create_semester(): void
    {
        $this->actingAs($this->instAdmin)
            ->post(route('admin.semesters.store'), [
                'name' => 'BCA 5th Semester',
                'academic_year' => '2026',
                'invite_code' => 'BCA5XYZ',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('semesters', [
            'name' => 'BCA 5th Semester',
            'institution_id' => $this->institution->id,
            'invite_code' => 'BCA5XYZ',
        ]);
    }

    public function test_super_admin_can_create_semester(): void
    {
        $this->actingAs($this->superAdmin)
            ->post(route('admin.semesters.store'), [
                'institution_id' => $this->institution->id,
                'name' => 'BCA 6th Semester',
                'invite_code' => 'BCA6ABC',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('semesters', [
            'name' => 'BCA 6th Semester',
            'invite_code' => 'BCA6ABC',
        ]);
    }

    public function test_institution_admin_can_update_semester(): void
    {
        $this->actingAs($this->instAdmin)
            ->put(route('admin.semesters.update', $this->semester), [
                'name' => 'Updated Semester',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('semesters', [
            'id' => $this->semester->id,
            'name' => 'Updated Semester',
        ]);
    }

    public function test_institution_admin_cannot_update_other_institution_semester(): void
    {
        $otherSemester = Semester::factory()->create(['institution_id' => $this->otherInstitution->id]);

        $this->actingAs($this->instAdmin)
            ->put(route('admin.semesters.update', $otherSemester), [
                'name' => 'Hacked',
            ])
            ->assertForbidden();
    }

    public function test_institution_admin_can_delete_semester(): void
    {
        $this->actingAs($this->instAdmin)
            ->delete(route('admin.semesters.destroy', $this->semester))
            ->assertRedirect();

        $this->assertDatabaseMissing('semesters', ['id' => $this->semester->id]);
    }

    public function test_semester_requires_name(): void
    {
        $this->actingAs($this->instAdmin)
            ->post(route('admin.semesters.store'), [
                'name' => '',
                'invite_code' => 'TEST123',
            ])
            ->assertSessionHasErrors('name');
    }

    public function test_semester_requires_invite_code(): void
    {
        $this->actingAs($this->instAdmin)
            ->post(route('admin.semesters.store'), [
                'name' => 'Test Semester',
                'invite_code' => '',
            ])
            ->assertSessionHasErrors('invite_code');
    }

    public function test_semester_invite_code_must_be_unique(): void
    {
        $this->actingAs($this->instAdmin)
            ->post(route('admin.semesters.store'), [
                'name' => 'Another Semester',
                'invite_code' => $this->semester->invite_code,
            ])
            ->assertSessionHasErrors('invite_code');
    }

    // === Super Admin ===

    public function test_super_admin_sees_all_semesters(): void
    {
        Semester::factory()->create(['institution_id' => $this->otherInstitution->id]);

        $this->actingAs($this->superAdmin)
            ->get(route('admin.semesters.index'))
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Semesters/Index', false)
                ->has('semesters.data', 2)
            );
    }
}
