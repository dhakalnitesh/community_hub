<?php

namespace Tests\Feature;

use App\Models\Academic\Assignment;
use App\Models\Core\Institution;
use App\Models\Academic\Section;
use App\Models\Academic\Semester;
use App\Models\Academic\Subject;
use App\Models\Core\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AssignmentTest extends TestCase
{
    use RefreshDatabase;

    private User $superAdmin;
    private User $instAdmin;
    private User $teacherJava;
    private User $teacherDL;
    private User $studentJava;
    private User $studentDL;
    private Subject $javaSubject;
    private Subject $dlSubject;
    private Assignment $assignmentJava;
    private Assignment $assignmentDL;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolesAndPermissionsSeeder::class);

        $institution = Institution::factory()->create();
        $semester = Semester::factory()->create(['institution_id' => $institution->id]);
        Section::factory()->create(['semester_id' => $semester->id]);

        $this->javaSubject = Subject::factory()->create([
            'semester_id' => $semester->id,
            'name' => 'Java Programming',
        ]);
        $this->dlSubject = Subject::factory()->create([
            'semester_id' => $semester->id,
            'name' => 'Digital Logic',
        ]);

        $this->teacherJava = User::factory()->teacher()->create();
        $this->teacherJava->assignRole('teacher');
        $this->javaSubject->teachers()->attach($this->teacherJava->id);

        $this->teacherDL = User::factory()->teacher()->create();
        $this->teacherDL->assignRole('teacher');
        $this->dlSubject->teachers()->attach($this->teacherDL->id);

        $this->studentJava = User::factory()->student()->create();
        $this->studentJava->assignRole('student');
        $semester->students()->attach($this->studentJava->id, ['status' => 'active']);

        $this->studentDL = User::factory()->student()->create();
        $this->studentDL->assignRole('student');

        $this->superAdmin = User::factory()->superAdmin()->create();
        $this->superAdmin->assignRole('super_admin');

        $this->instAdmin = User::factory()->institutionAdmin()->create();
        $this->instAdmin->assignRole('institution_admin');
        $institution->users()->attach($this->instAdmin->id, ['role' => 'institution_admin']);

        $this->assignmentJava = Assignment::factory()->create([
            'subject_id' => $this->javaSubject->id,
            'teacher_id' => $this->teacherJava->id,
        ]);

        $this->assignmentDL = Assignment::factory()->create([
            'subject_id' => $this->dlSubject->id,
            'teacher_id' => $this->teacherDL->id,
        ]);
    }

    // === Authentication ===

    public function test_guest_redirected_to_login_for_index(): void
    {
        $this->get(route('assignments.index'))->assertRedirect(route('login'));
    }

    public function test_guest_redirected_to_login_for_show(): void
    {
        $this->get(route('assignments.show', $this->assignmentJava))
            ->assertRedirect(route('login'));
    }

    public function test_guest_redirected_to_login_for_create(): void
    {
        $this->get(route('assignments.create'))->assertRedirect(route('login'));
    }

    public function test_guest_redirected_to_login_for_store(): void
    {
        $this->post(route('assignments.store'), [
            'subject_id' => $this->javaSubject->id,
            'title' => 'Test',
            'due_date' => now()->addWeek(),
        ])->assertRedirect(route('login'));
    }

    public function test_guest_redirected_to_login_for_edit(): void
    {
        $this->get(route('assignments.edit', $this->assignmentJava))
            ->assertRedirect(route('login'));
    }

    public function test_guest_redirected_to_login_for_update(): void
    {
        $this->put(route('assignments.update', $this->assignmentJava), [
            'title' => 'Hacked',
        ])->assertRedirect(route('login'));
    }

    public function test_guest_redirected_to_login_for_destroy(): void
    {
        $this->delete(route('assignments.destroy', $this->assignmentJava))
            ->assertRedirect(route('login'));
    }

    // === Scope Isolation: Teacher ===

    public function test_teacher_sees_only_their_subject_assignments(): void
    {
        $response = $this->actingAs($this->teacherJava)
            ->get(route('assignments.index'));

        $response->assertInertia(fn ($page) => $page
            ->component('Assignments/Index')
            ->has('assignments.data', 1)
            ->where('assignments.data.0.id', $this->assignmentJava->id)
        );
    }

    public function test_teacher_cannot_see_other_subject_assignments(): void
    {
        $response = $this->actingAs($this->teacherDL)
            ->get(route('assignments.index'));

        $response->assertInertia(fn ($page) => $page
            ->component('Assignments/Index')
            ->has('assignments.data', 1)
            ->where('assignments.data.0.id', $this->assignmentDL->id)
        );
    }

    // === Scope Isolation: SuperAdmin ===

    public function test_super_admin_sees_all_assignments(): void
    {
        $response = $this->actingAs($this->superAdmin)
            ->get(route('assignments.index'));

        $response->assertInertia(fn ($page) => $page
            ->component('Assignments/Index')
            ->has('assignments.data', 2)
        );
    }

    // === Scope Isolation: Student ===

    public function test_student_sees_assignments_for_enrolled_subjects(): void
    {
        $response = $this->actingAs($this->studentJava)
            ->get(route('assignments.index'));

        $response->assertInertia(fn ($page) => $page
            ->component('Assignments/Index')
            ->has('assignments.data')
        );
    }

    // === CRUD: Create ===

    public function test_teacher_can_create_assignment(): void
    {
        $this->actingAs($this->teacherJava)
            ->post(route('assignments.store'), [
                'subject_id' => $this->javaSubject->id,
                'title' => 'Midterm Project',
                'description' => 'Build a CRUD app',
                'max_score' => 100,
                'due_date' => now()->addWeeks(2)->format('Y-m-d'),
                'allow_late_submission' => true,
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('assignments', [
            'subject_id' => $this->javaSubject->id,
            'teacher_id' => $this->teacherJava->id,
            'title' => 'Midterm Project',
        ]);
    }

    public function test_teacher_cannot_create_assignment_for_other_subject(): void
    {
        $this->actingAs($this->teacherJava)
            ->post(route('assignments.store'), [
                'subject_id' => $this->dlSubject->id,
                'title' => 'Should fail',
                'due_date' => now()->addWeek()->format('Y-m-d'),
            ])
            ->assertForbidden();
    }

    public function test_student_cannot_create_assignment(): void
    {
        $this->actingAs($this->studentJava)
            ->post(route('assignments.store'), [
                'subject_id' => $this->javaSubject->id,
                'title' => 'Student assignment',
                'due_date' => now()->addWeek()->format('Y-m-d'),
            ])
            ->assertForbidden();
    }

    public function test_assignment_requires_title(): void
    {
        $this->actingAs($this->teacherJava)
            ->post(route('assignments.store'), [
                'subject_id' => $this->javaSubject->id,
                'title' => '',
                'due_date' => now()->addWeek()->format('Y-m-d'),
            ])
            ->assertSessionHasErrors('title');
    }

    public function test_assignment_requires_due_date(): void
    {
        $this->actingAs($this->teacherJava)
            ->post(route('assignments.store'), [
                'subject_id' => $this->javaSubject->id,
                'title' => 'No due date',
                'due_date' => '',
            ])
            ->assertSessionHasErrors('due_date');
    }

    public function test_assignment_max_score_must_be_positive(): void
    {
        $this->actingAs($this->teacherJava)
            ->post(route('assignments.store'), [
                'subject_id' => $this->javaSubject->id,
                'title' => 'Bad score',
                'due_date' => now()->addWeek()->format('Y-m-d'),
                'max_score' => -1,
            ])
            ->assertSessionHasErrors('max_score');
    }

    // === CRUD: Update ===

    public function test_teacher_can_update_own_assignment(): void
    {
        $this->actingAs($this->teacherJava)
            ->put(route('assignments.update', $this->assignmentJava), [
                'title' => 'Updated title',
                'description' => 'Updated description',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('assignments', [
            'id' => $this->assignmentJava->id,
            'title' => 'Updated title',
        ]);
    }

    public function test_other_teacher_cannot_update_assignment(): void
    {
        $this->actingAs($this->teacherDL)
            ->put(route('assignments.update', $this->assignmentJava), [
                'title' => 'Hacked title',
            ])
            ->assertForbidden();
    }

    // === CRUD: Delete ===

    public function test_teacher_can_delete_own_assignment(): void
    {
        $this->actingAs($this->teacherJava)
            ->delete(route('assignments.destroy', $this->assignmentJava))
            ->assertRedirect();

        $this->assertSoftDeleted($this->assignmentJava);
    }

    public function test_teacher_cannot_delete_other_subject_assignment(): void
    {
        $this->actingAs($this->teacherJava)
            ->delete(route('assignments.destroy', $this->assignmentDL))
            ->assertForbidden();
    }

    public function test_student_cannot_delete_assignment(): void
    {
        $this->actingAs($this->studentJava)
            ->delete(route('assignments.destroy', $this->assignmentJava))
            ->assertForbidden();
    }

    // === Inertia Page Rendering ===

    public function test_assignments_index_page_renders(): void
    {
        $response = $this->actingAs($this->superAdmin)
            ->get(route('assignments.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Assignments/Index', false)
            ->has('assignments')
        );
    }

    public function test_assignments_create_page_renders(): void
    {
        $this->actingAs($this->teacherJava)
            ->get(route('assignments.create'))
            ->assertInertia(fn ($page) => $page
                ->component('Assignments/Create', false)
                ->has('subjects')
            );
    }

    public function test_assignments_show_page_renders(): void
    {
        $this->actingAs($this->superAdmin)
            ->get(route('assignments.show', $this->assignmentJava))
            ->assertInertia(fn ($page) => $page
                ->component('Assignments/Show', false)
                ->has('assignment')
            );
    }

    public function test_assignments_edit_page_renders(): void
    {
        $this->actingAs($this->teacherJava)
            ->get(route('assignments.edit', $this->assignmentJava))
            ->assertInertia(fn ($page) => $page
                ->component('Assignments/Edit', false)
                ->has('assignment')
            );
    }

    // === Factory ===

    public function test_assignment_factory_creates_model(): void
    {
        $assignment = Assignment::factory()->create([
            'subject_id' => $this->javaSubject->id,
            'teacher_id' => $this->teacherJava->id,
        ]);

        $this->assertInstanceOf(Assignment::class, $assignment);
        $this->assertNotNull($assignment->title);
        $this->assertNotNull($assignment->subject_id);
        $this->assertNotNull($assignment->teacher_id);
    }
}
