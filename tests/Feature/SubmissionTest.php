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

class SubmissionTest extends TestCase
{
    use RefreshDatabase;

    private User $teacher;
    private User $student;
    private User $otherStudent;
    private Assignment $assignment;
    private Subject $subject;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolesAndPermissionsSeeder::class);

        $institution = Institution::factory()->create();
        $semester = Semester::factory()->create(['institution_id' => $institution->id]);
        Section::factory()->create(['semester_id' => $semester->id]);

        $this->subject = Subject::factory()->create(['semester_id' => $semester->id]);

        $this->teacher = User::factory()->teacher()->create();
        $this->teacher->assignRole('teacher');
        $this->subject->teachers()->attach($this->teacher->id);

        $this->student = User::factory()->student()->create();
        $this->student->assignRole('student');
        $semester->students()->attach($this->student->id, ['status' => 'active']);

        $this->otherStudent = User::factory()->student()->create();
        $this->otherStudent->assignRole('student');

        $this->assignment = Assignment::factory()->create([
            'subject_id' => $this->subject->id,
            'teacher_id' => $this->teacher->id,
            'due_date' => now()->addWeek(),
            'allow_late_submission' => true,
            'max_score' => 100,
        ]);
    }

    // === Authentication ===

    public function test_guest_cannot_submit(): void
    {
        $this->post(route('assignments.submissions.store', $this->assignment), [
            'content' => 'Guest submission',
        ])->assertRedirect(route('login'));
    }

    public function test_guest_cannot_view_submission(): void
    {
        $this->get(route('assignments.submissions.show', 1))
            ->assertRedirect(route('login'));
    }

    // === CRUD: Create Submission ===

    public function test_student_can_submit_to_enrolled_subject_assignment(): void
    {
        $this->actingAs($this->student)
            ->post(route('assignments.submissions.store', $this->assignment), [
                'content' => 'My assignment submission',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('submissions', [
            'assignment_id' => $this->assignment->id,
            'student_id' => $this->student->id,
            'content' => 'My assignment submission',
            'status' => 'submitted',
        ]);
    }

    public function test_student_cannot_submit_to_unenrolled_subject_assignment(): void
    {
        $this->actingAs($this->otherStudent)
            ->post(route('assignments.submissions.store', $this->assignment), [
                'content' => 'Should not work',
            ])
            ->assertForbidden();
    }

    public function test_student_cannot_submit_twice(): void
    {
        $this->actingAs($this->student)
            ->post(route('assignments.submissions.store', $this->assignment), [
                'content' => 'First submission',
            ]);

        $this->actingAs($this->student)
            ->post(route('assignments.submissions.store', $this->assignment), [
                'content' => 'Duplicate submission',
            ])
            ->assertForbidden();
    }

    public function test_submission_requires_content_or_file(): void
    {
        $this->actingAs($this->student)
            ->post(route('assignments.submissions.store', $this->assignment), [
                'content' => '',
                'files' => [],
            ])
            ->assertSessionHasErrors(['content', 'files']);
    }

    // === Late Submission ===

    public function test_late_submission_detected_when_past_due(): void
    {
        $pastDueAssignment = Assignment::factory()->create([
            'subject_id' => $this->subject->id,
            'teacher_id' => $this->teacher->id,
            'due_date' => now()->subDay(),
            'allow_late_submission' => true,
        ]);

        $this->actingAs($this->student)
            ->post(route('assignments.submissions.store', $pastDueAssignment), [
                'content' => 'Late submission',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('submissions', [
            'assignment_id' => $pastDueAssignment->id,
            'student_id' => $this->student->id,
            'is_late' => true,
        ]);
    }

    public function test_late_submission_blocked_when_disallowed(): void
    {
        $pastDueNoLate = Assignment::factory()->create([
            'subject_id' => $this->subject->id,
            'teacher_id' => $this->teacher->id,
            'due_date' => now()->subDay(),
            'allow_late_submission' => false,
        ]);

        $this->actingAs($this->student)
            ->post(route('assignments.submissions.store', $pastDueNoLate), [
                'content' => 'Should be blocked',
            ])
            ->assertForbidden();
    }

    // === View Submission ===

    public function test_student_can_view_own_submission(): void
    {
        $submission = \App\Models\Academic\Submission::factory()->create([
            'assignment_id' => $this->assignment->id,
            'student_id' => $this->student->id,
        ]);

        $this->actingAs($this->student)
            ->get(route('assignments.submissions.show', $submission))
            ->assertInertia(fn ($page) => $page
                ->component('Assignments/Submission')
                ->has('submission')
            );
    }

    public function test_other_student_cannot_view_submission(): void
    {
        $submission = \App\Models\Academic\Submission::factory()->create([
            'assignment_id' => $this->assignment->id,
            'student_id' => $this->student->id,
        ]);

        $this->actingAs($this->otherStudent)
            ->get(route('assignments.submissions.show', $submission))
            ->assertForbidden();
    }

    public function test_teacher_can_view_submission_for_their_assignment(): void
    {
        $submission = \App\Models\Academic\Submission::factory()->create([
            'assignment_id' => $this->assignment->id,
            'student_id' => $this->student->id,
        ]);

        $this->actingAs($this->teacher)
            ->get(route('assignments.submissions.show', $submission))
            ->assertInertia(fn ($page) => $page
                ->component('Assignments/Submission')
                ->has('submission')
            );
    }

    // === Grading ===

    public function test_teacher_can_grade_submission(): void
    {
        $submission = \App\Models\Academic\Submission::factory()->create([
            'assignment_id' => $this->assignment->id,
            'student_id' => $this->student->id,
        ]);

        $response = $this->actingAs($this->teacher)
            ->put(route('assignments.submissions.update', $submission), [
                'score' => 85,
                'feedback' => 'Great work!',
            ]);

        $response->assertRedirect();
        $response->assertSessionHasNoErrors();

        $this->assertDatabaseHas('submissions', [
            'id' => $submission->id,
            'score' => 85,
            'feedback' => 'Great work!',
            'status' => 'graded',
        ]);
    }

    public function test_other_teacher_cannot_grade_submission(): void
    {
        $otherTeacher = User::factory()->teacher()->create();
        $otherTeacher->assignRole('teacher');

        $submission = \App\Models\Academic\Submission::factory()->create([
            'assignment_id' => $this->assignment->id,
            'student_id' => $this->student->id,
        ]);

        $this->actingAs($otherTeacher)
            ->put(route('assignments.submissions.update', $submission), [
                'score' => 50,
                'feedback' => 'Not my student',
            ])
            ->assertForbidden();
    }

    public function test_student_cannot_grade(): void
    {
        $submission = \App\Models\Academic\Submission::factory()->create([
            'assignment_id' => $this->assignment->id,
            'student_id' => $this->student->id,
        ]);

        $this->actingAs($this->student)
            ->put(route('assignments.submissions.update', $submission), [
                'score' => 100,
                'feedback' => 'Self grading',
            ])
            ->assertForbidden();
    }

    public function test_score_cannot_exceed_max_score(): void
    {
        $submission = \App\Models\Academic\Submission::factory()->create([
            'assignment_id' => $this->assignment->id,
            'student_id' => $this->student->id,
        ]);

        $this->actingAs($this->teacher)
            ->put(route('assignments.submissions.update', $submission), [
                'score' => 999,
                'feedback' => 'Over max',
            ])
            ->assertSessionHasErrors('score');
    }

    public function test_score_must_be_positive(): void
    {
        $submission = \App\Models\Academic\Submission::factory()->create([
            'assignment_id' => $this->assignment->id,
            'student_id' => $this->student->id,
        ]);

        $this->actingAs($this->teacher)
            ->put(route('assignments.submissions.update', $submission), [
                'score' => -5,
                'feedback' => 'Negative',
            ])
            ->assertSessionHasErrors('score');
    }
}
