<?php

namespace Tests\Feature;

use App\Models\Core\Institution;
use App\Models\Academic\Semester;
use App\Models\Academic\Subject;
use App\Models\Core\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SubjectManagementTest extends TestCase
{
    use RefreshDatabase;

    private User $superAdmin;
    private User $instAdmin;
    private User $teacher;
    private User $student;
    private Institution $institution;
    private Institution $otherInstitution;
    private Semester $semester;
    private Semester $otherSemester;
    private Subject $subject;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolesAndPermissionsSeeder::class);

        $this->institution = Institution::factory()->create();
        $this->otherInstitution = Institution::factory()->create();

        $this->semester = Semester::factory()->create(['institution_id' => $this->institution->id]);
        $this->otherSemester = Semester::factory()->create(['institution_id' => $this->otherInstitution->id]);

        $this->superAdmin = User::factory()->superAdmin()->create();
        $this->superAdmin->assignRole('super_admin');

        $this->instAdmin = User::factory()->institutionAdmin()->create();
        $this->instAdmin->assignRole('institution_admin');
        $this->institution->users()->attach($this->instAdmin->id, ['role' => 'institution_admin']);

        $this->teacher = User::factory()->teacher()->create();
        $this->teacher->assignRole('teacher');

        $this->student = User::factory()->student()->create();
        $this->student->assignRole('student');

        $this->subject = Subject::factory()->create(['semester_id' => $this->semester->id]);
    }

    // === Auth ===

    public function test_guest_cannot_list_subjects(): void
    {
        $this->get(route('admin.subjects.index'))->assertRedirect(route('login'));
    }

    // === Access ===

    public function test_institution_admin_can_list_subjects(): void
    {
        $this->actingAs($this->instAdmin)
            ->get(route('admin.subjects.index'))
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Subjects/Index', false)
                ->has('subjects.data')
            );
    }

    public function test_institution_admin_only_sees_own_institution_subjects(): void
    {
        Subject::factory()->create(['semester_id' => $this->otherSemester->id]);

        $this->actingAs($this->instAdmin)
            ->get(route('admin.subjects.index'))
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Subjects/Index', false)
                ->has('subjects.data', 1)
            );
    }

    public function test_teacher_cannot_manage_subjects(): void
    {
        $this->actingAs($this->teacher)
            ->get(route('admin.subjects.index'))
            ->assertForbidden();
    }

    // === CRUD ===

    public function test_institution_admin_can_create_subject(): void
    {
        $this->actingAs($this->instAdmin)
            ->post(route('admin.subjects.store'), [
                'semester_id' => $this->semester->id,
                'name' => 'Artificial Intelligence',
                'code' => 'BCA501',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('subjects', [
            'name' => 'Artificial Intelligence',
            'semester_id' => $this->semester->id,
        ]);
    }

    public function test_institution_admin_cannot_create_subject_in_other_institution(): void
    {
        $this->actingAs($this->instAdmin)
            ->post(route('admin.subjects.store'), [
                'semester_id' => $this->otherSemester->id,
                'name' => 'Other Subject',
                'code' => 'OTH001',
            ])
            ->assertForbidden();
    }

    public function test_institution_admin_can_update_subject(): void
    {
        $this->actingAs($this->instAdmin)
            ->put(route('admin.subjects.update', $this->subject), [
                'name' => 'Updated Subject Name',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('subjects', [
            'id' => $this->subject->id,
            'name' => 'Updated Subject Name',
        ]);
    }

    public function test_institution_admin_can_delete_subject(): void
    {
        $this->actingAs($this->instAdmin)
            ->delete(route('admin.subjects.destroy', $this->subject))
            ->assertRedirect();

        $this->assertDatabaseMissing('subjects', ['id' => $this->subject->id]);
    }

    public function test_subject_requires_name(): void
    {
        $this->actingAs($this->instAdmin)
            ->post(route('admin.subjects.store'), [
                'semester_id' => $this->semester->id,
                'name' => '',
                'code' => 'TEST01',
            ])
            ->assertSessionHasErrors('name');
    }

    // === Teacher Assignment ===

    public function test_institution_admin_can_assign_teacher_to_subject(): void
    {
        $this->actingAs($this->instAdmin)
            ->post(route('admin.subjects.teachers.assign', $this->subject), [
                'teacher_id' => $this->teacher->id,
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('subject_teachers', [
            'subject_id' => $this->subject->id,
            'teacher_id' => $this->teacher->id,
        ]);
    }

    public function test_institution_admin_can_remove_teacher_from_subject(): void
    {
        $this->subject->teachers()->attach($this->teacher->id);

        $this->actingAs($this->instAdmin)
            ->delete(route('admin.subjects.teachers.remove', [
                'subject' => $this->subject,
                'teacher' => $this->teacher,
            ]))
            ->assertRedirect();

        $this->assertDatabaseMissing('subject_teachers', [
            'subject_id' => $this->subject->id,
            'teacher_id' => $this->teacher->id,
        ]);
    }

    public function test_cannot_assign_non_teacher_to_subject(): void
    {
        $this->actingAs($this->instAdmin)
            ->post(route('admin.subjects.teachers.assign', $this->subject), [
                'teacher_id' => $this->student->id,
            ])
            ->assertSessionHasErrors('teacher_id');
    }
}
