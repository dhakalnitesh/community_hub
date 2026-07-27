<?php

namespace Tests\Feature;

use App\Models\Core\Institution;
use App\Models\Academic\Semester;
use App\Models\Core\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EnrollmentTest extends TestCase
{
    use RefreshDatabase;

    private User $student;
    private User $otherStudent;
    private User $instAdmin;
    private Semester $semester;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolesAndPermissionsSeeder::class);

        $institution = Institution::factory()->create();

        $this->semester = Semester::factory()->create([
            'institution_id' => $institution->id,
            'invite_code' => 'BCA3XYZ',
            'is_active' => true,
        ]);

        $this->instAdmin = User::factory()->institutionAdmin()->create();
        $this->instAdmin->assignRole('institution_admin');
        $institution->users()->attach($this->instAdmin->id, ['role' => 'institution_admin']);

        $this->student = User::factory()->student()->create();
        $this->student->assignRole('student');

        $this->otherStudent = User::factory()->student()->create();
        $this->otherStudent->assignRole('student');
    }

    // === Enrollment via Invite Code ===

    public function test_student_can_enroll_with_valid_invite_code(): void
    {
        $this->actingAs($this->student)
            ->post(route('enroll'), [
                'invite_code' => 'BCA3XYZ',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('semester_students', [
            'semester_id' => $this->semester->id,
            'student_id' => $this->student->id,
            'status' => 'active',
        ]);
    }

    public function test_student_cannot_enroll_with_invalid_invite_code(): void
    {
        $this->actingAs($this->student)
            ->post(route('enroll'), [
                'invite_code' => 'INVALID',
            ])
            ->assertSessionHasErrors('invite_code');
    }

    public function test_student_cannot_enroll_twice_in_same_semester(): void
    {
        // First enrollment
        $this->actingAs($this->student)
            ->post(route('enroll'), ['invite_code' => 'BCA3XYZ']);

        // Second attempt
        $this->actingAs($this->student)
            ->post(route('enroll'), ['invite_code' => 'BCA3XYZ'])
            ->assertSessionHasErrors('invite_code');
    }

    public function test_guest_cannot_enroll(): void
    {
        $this->post(route('enroll'), [
            'invite_code' => 'BCA3XYZ',
        ])->assertRedirect(route('login'));
    }

    public function test_enroll_requires_invite_code(): void
    {
        $this->actingAs($this->student)
            ->post(route('enroll'), [
                'invite_code' => '',
            ])
            ->assertSessionHasErrors('invite_code');
    }

    // === Admin Enrollment Management ===

    public function test_admin_can_view_enrollments(): void
    {
        $this->semester->students()->attach($this->student->id, ['status' => 'active']);

        $this->actingAs($this->instAdmin)
            ->get(route('admin.enrollments.index'))
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Enrollments/Index', false)
                ->has('enrollments.data')
            );
    }

    public function test_admin_can_remove_student_from_semester(): void
    {
        $this->semester->students()->attach($this->student->id, ['status' => 'active']);

        $this->actingAs($this->instAdmin)
            ->delete(route('admin.enrollments.remove', [
                'semester' => $this->semester,
                'student' => $this->student,
            ]))
            ->assertRedirect();

        $this->assertDatabaseMissing('semester_students', [
            'semester_id' => $this->semester->id,
            'student_id' => $this->student->id,
        ]);
    }

    public function test_teacher_cannot_manage_enrollments(): void
    {
        $teacher = User::factory()->teacher()->create();
        $teacher->assignRole('teacher');

        $this->actingAs($teacher)
            ->get(route('admin.enrollments.index'))
            ->assertForbidden();
    }
}
