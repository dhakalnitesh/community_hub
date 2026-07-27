<?php

namespace Tests\Feature;

use App\Models\Community\Discussion;
use App\Models\Community\DiscussionAnswer;
use App\Models\Core\Institution;
use App\Models\Academic\Semester;
use App\Models\Academic\Subject;
use App\Models\Core\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DiscussionAnswerTest extends TestCase
{
    use RefreshDatabase;

    private User $teacher;
    private User $student;
    private User $otherStudent;
    private Discussion $discussion;
    private DiscussionAnswer $answer;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolesAndPermissionsSeeder::class);

        $institution = Institution::factory()->create();
        $semester = Semester::factory()->create(['institution_id' => $institution->id]);
        $subject = Subject::factory()->create(['semester_id' => $semester->id]);

        $this->teacher = User::factory()->teacher()->create();
        $this->teacher->assignRole('teacher');
        $subject->teachers()->attach($this->teacher->id);

        $this->student = User::factory()->student()->create();
        $this->student->assignRole('student');
        $semester->students()->attach($this->student->id, ['status' => 'active']);

        $this->otherStudent = User::factory()->student()->create();
        $this->otherStudent->assignRole('student');

        $this->discussion = Discussion::factory()->create([
            'user_id' => $this->student->id,
            'discussionable_id' => $subject->id,
            'discussionable_type' => 'subject',
        ]);

        $this->answer = DiscussionAnswer::factory()->create([
            'discussion_id' => $this->discussion->id,
            'user_id' => $this->teacher->id,
        ]);
    }

    public function test_student_can_create_answer(): void
    {
        $this->actingAs($this->student)
            ->post(route('questions.answers.store', $this->discussion), [
                'body' => 'This is a helpful answer.',
                'is_anonymous' => false,
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('discussion_answers', [
            'discussion_id' => $this->discussion->id,
            'user_id' => $this->student->id,
            'body' => 'This is a helpful answer.',
        ]);
    }

    public function test_anonymous_answer_stores_correctly(): void
    {
        $this->actingAs($this->student)
            ->post(route('questions.answers.store', $this->discussion), [
                'body' => 'Anonymous answer body',
                'is_anonymous' => true,
            ])
            ->assertRedirect();

        $answer = DiscussionAnswer::where('body', 'Anonymous answer body')->first();
        $this->assertTrue($answer->is_anonymous);
        $this->assertEquals($this->student->id, $answer->user_id);
    }

    public function test_answer_requires_body(): void
    {
        $this->actingAs($this->student)
            ->post(route('questions.answers.store', $this->discussion), [
                'body' => '',
                'is_anonymous' => false,
            ])
            ->assertSessionHasErrors('body');
    }

    public function test_guest_cannot_create_answer(): void
    {
        $this->post(route('questions.answers.store', $this->discussion), [
            'body' => 'Guest answer',
        ])->assertRedirect(route('login'));
    }

    public function test_author_can_update_own_answer(): void
    {
        $this->actingAs($this->teacher)
            ->put(route('questions.answers.update', $this->answer), [
                'body' => 'Updated answer body',
                'is_anonymous' => false,
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('discussion_answers', [
            'id' => $this->answer->id,
            'body' => 'Updated answer body',
        ]);
    }

    public function test_other_user_cannot_update_answer(): void
    {
        $this->actingAs($this->otherStudent)
            ->put(route('questions.answers.update', $this->answer), [
                'body' => 'Hacked answer',
                'is_anonymous' => false,
            ])
            ->assertForbidden();
    }

    public function test_author_can_delete_own_answer(): void
    {
        $this->actingAs($this->teacher)
            ->delete(route('questions.answers.destroy', $this->answer))
            ->assertRedirect();

        $this->assertSoftDeleted($this->answer);
    }

    public function test_other_user_cannot_delete_answer(): void
    {
        $this->actingAs($this->otherStudent)
            ->delete(route('questions.answers.destroy', $this->answer))
            ->assertForbidden();
    }

    public function test_accept_answer(): void
    {
        $this->assertFalse($this->answer->is_accepted);

        $this->actingAs($this->student)
            ->post(route('questions.answers.accept', $this->answer))
            ->assertRedirect();

        $this->answer->refresh();
        $this->assertTrue($this->answer->is_accepted);
    }

    public function test_other_user_cannot_accept_answer(): void
    {
        $this->actingAs($this->otherStudent)
            ->post(route('questions.answers.accept', $this->answer))
            ->assertForbidden();
    }

    public function test_toggle_accept_answer(): void
    {
        $this->actingAs($this->student)->post(route('questions.answers.accept', $this->answer));
        $this->answer->refresh();
        $this->assertTrue($this->answer->is_accepted);

        $this->actingAs($this->student)->post(route('questions.answers.accept', $this->answer));
        $this->answer->refresh();
        $this->assertFalse($this->answer->is_accepted);
    }

    public function test_answer_shows_anonymous_name_when_anonymous(): void
    {
        $anonAnswer = DiscussionAnswer::factory()->create([
            'discussion_id' => $this->discussion->id,
            'user_id' => $this->student->id,
            'is_anonymous' => true,
        ]);

        $this->assertEquals(
            $this->student->anonymous_name,
            $anonAnswer->author_name
        );
    }

    public function test_answer_shows_real_name_when_public(): void
    {
        $this->assertEquals(
            $this->teacher->name,
            $this->answer->author_name
        );
    }
}
