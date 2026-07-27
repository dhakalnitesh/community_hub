<?php

namespace Tests\Feature;

use App\Models\Community\Discussion;
use App\Models\Community\DiscussionAnswer;
use App\Models\Core\Institution;
use App\Models\Academic\Semester;
use App\Models\Academic\Subject;
use App\Models\Core\User;
use App\Models\Community\Vote;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VoteTest extends TestCase
{
    use RefreshDatabase;

    private User $user1;
    private User $user2;
    private Discussion $discussion;
    private DiscussionAnswer $answer;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolesAndPermissionsSeeder::class);

        $institution = Institution::factory()->create();
        $semester = Semester::factory()->create(['institution_id' => $institution->id]);
        $subject = Subject::factory()->create(['semester_id' => $semester->id]);
        $teacher = User::factory()->teacher()->create();
        $teacher->assignRole('teacher');
        $subject->teachers()->attach($teacher->id);

        $this->user1 = User::factory()->student()->create();
        $this->user1->assignRole('student');
        $semester->students()->attach($this->user1->id, ['status' => 'active']);

        $this->user2 = User::factory()->student()->create();
        $this->user2->assignRole('student');
        $semester->students()->attach($this->user2->id, ['status' => 'active']);

        $this->discussion = Discussion::factory()->create([
            'user_id' => $this->user1->id,
            'discussionable_id' => $subject->id,
            'discussionable_type' => 'subject',
        ]);

        $this->answer = DiscussionAnswer::factory()->create([
            'discussion_id' => $this->discussion->id,
            'user_id' => $teacher->id,
        ]);
    }

    public function test_user_can_upvote_discussion(): void
    {
        $this->actingAs($this->user2)
            ->post(route('questions.vote'), [
                'votable_type' => 'discussion',
                'votable_id' => $this->discussion->id,
                'type' => 'upvote',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('votes', [
            'user_id' => $this->user2->id,
            'votable_type' => 'discussion',
            'votable_id' => $this->discussion->id,
            'type' => 'upvote',
        ]);
    }

    public function test_user_can_downvote_discussion(): void
    {
        $this->actingAs($this->user2)
            ->post(route('questions.vote'), [
                'votable_type' => 'discussion',
                'votable_id' => $this->discussion->id,
                'type' => 'downvote',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('votes', [
            'user_id' => $this->user2->id,
            'type' => 'downvote',
        ]);
    }

    public function test_user_can_upvote_answer(): void
    {
        $this->actingAs($this->user1)
            ->post(route('questions.vote'), [
                'votable_type' => 'discussion_answer',
                'votable_id' => $this->answer->id,
                'type' => 'upvote',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('votes', [
            'user_id' => $this->user1->id,
            'votable_type' => 'discussion_answer',
            'votable_id' => $this->answer->id,
            'type' => 'upvote',
        ]);
    }

    public function test_toggle_upvote_removes_vote(): void
    {
        Vote::create([
            'user_id' => $this->user2->id,
            'votable_type' => 'discussion',
            'votable_id' => $this->discussion->id,
            'type' => 'upvote',
        ]);

        $this->assertEquals(1, $this->discussion->votes()->count());

        $this->actingAs($this->user2)
            ->post(route('questions.vote'), [
                'votable_type' => 'discussion',
                'votable_id' => $this->discussion->id,
                'type' => 'upvote',
            ]);

        $this->assertEquals(0, $this->discussion->votes()->count());
    }

    public function test_switch_upvote_to_downvote(): void
    {
        Vote::create([
            'user_id' => $this->user2->id,
            'votable_type' => 'discussion',
            'votable_id' => $this->discussion->id,
            'type' => 'upvote',
        ]);

        $this->actingAs($this->user2)
            ->post(route('questions.vote'), [
                'votable_type' => 'discussion',
                'votable_id' => $this->discussion->id,
                'type' => 'downvote',
            ]);

        $vote = Vote::where('user_id', $this->user2->id)
            ->where('votable_type', 'discussion')
            ->where('votable_id', $this->discussion->id)
            ->first();

        $this->assertNotNull($vote);
        $this->assertEquals('downvote', $vote->type);
    }

    public function test_prevent_duplicate_votes(): void
    {
        Vote::create([
            'user_id' => $this->user2->id,
            'votable_type' => 'discussion',
            'votable_id' => $this->discussion->id,
            'type' => 'upvote',
        ]);

        $this->actingAs($this->user2)
            ->post(route('questions.vote'), [
                'votable_type' => 'discussion',
                'votable_id' => $this->discussion->id,
                'type' => 'upvote',
            ]);

        $this->assertEquals(0, $this->discussion->votes()->count()); // toggled off
    }

    public function test_multiple_users_can_vote(): void
    {
        $this->actingAs($this->user1)
            ->post(route('questions.vote'), [
                'votable_type' => 'discussion',
                'votable_id' => $this->discussion->id,
                'type' => 'upvote',
            ]);

        $this->actingAs($this->user2)
            ->post(route('questions.vote'), [
                'votable_type' => 'discussion',
                'votable_id' => $this->discussion->id,
                'type' => 'upvote',
            ]);

        $this->assertEquals(2, $this->discussion->votes()->count());
    }

    public function test_guest_cannot_vote(): void
    {
        $this->post(route('questions.vote'), [
            'votable_type' => 'discussion',
            'votable_id' => $this->discussion->id,
            'type' => 'upvote',
        ])->assertRedirect(route('login'));
    }

    public function test_vote_requires_valid_type(): void
    {
        $this->actingAs($this->user1)
            ->post(route('questions.vote'), [
                'votable_type' => 'discussion',
                'votable_id' => $this->discussion->id,
                'type' => 'invalid',
            ])
            ->assertSessionHasErrors('type');
    }

    public function test_vote_requires_valid_votable_type(): void
    {
        $this->actingAs($this->user1)
            ->post(route('questions.vote'), [
                'votable_type' => 'invalid_type',
                'votable_id' => 1,
                'type' => 'upvote',
            ])
            ->assertSessionHasErrors('votable_type');
    }
}
