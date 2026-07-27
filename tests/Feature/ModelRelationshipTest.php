<?php

namespace Tests\Feature;

use App\Models\Community\Discussion;
use App\Models\Community\DiscussionAnswer;
use App\Models\Core\Institution;
use App\Models\Academic\Section;
use App\Models\Academic\Semester;
use App\Models\Academic\Subject;
use App\Models\Core\User;
use App\Models\Community\Vote;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ModelRelationshipTest extends TestCase
{
    use RefreshDatabase;

    private User $student;
    private User $teacher;
    private Institution $institution;
    private Semester $semester;
    private Section $section;
    private Subject $subject;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolesAndPermissionsSeeder::class);

        $this->institution = Institution::factory()->create();

        $this->semester = Semester::factory()->create([
            'institution_id' => $this->institution->id,
        ]);

        $this->section = Section::factory()->create([
            'semester_id' => $this->semester->id,
        ]);

        $this->subject = Subject::factory()->create([
            'semester_id' => $this->semester->id,
        ]);

        $this->teacher = User::factory()->teacher()->create();
        $this->teacher->assignRole('teacher');
        $this->subject->teachers()->attach($this->teacher->id);

        $this->student = User::factory()->student()->create();
        $this->student->assignRole('student');
        $this->semester->students()->attach($this->student->id, [
            'section_id' => $this->section->id,
            'status' => 'active',
        ]);
    }

    public function test_user_belongs_to_institutions(): void
    {
        $this->institution->users()->attach($this->teacher->id, ['role' => 'teacher']);

        $this->assertCount(1, $this->teacher->institutions);
        $this->assertEquals($this->institution->id, $this->teacher->institutions->first()->id);
    }

    public function test_teacher_taught_subjects(): void
    {
        $this->assertCount(1, $this->teacher->taughtSubjects);
        $this->assertEquals($this->subject->id, $this->teacher->taughtSubjects->first()->id);
    }

    public function test_student_enrolled_semesters(): void
    {
        $this->assertCount(1, $this->student->enrolledSemesters);
        $this->assertEquals($this->semester->id, $this->student->enrolledSemesters->first()->id);
    }

    public function test_subject_belongs_to_semester(): void
    {
        $this->assertEquals($this->semester->id, $this->subject->semester->id);
    }

    public function test_semester_belongs_to_institution(): void
    {
        $this->assertEquals($this->institution->id, $this->semester->institution->id);
    }

    public function test_semester_has_sections(): void
    {
        $this->assertCount(1, $this->semester->sections);
        $this->assertEquals($this->section->id, $this->semester->sections->first()->id);
    }

    public function test_discussion_morphs_to_subject(): void
    {
        $discussion = Discussion::create([
            'user_id' => $this->student->id,
            'discussionable_id' => $this->subject->id,
            'discussionable_type' => 'subject',
            'title' => 'Test Question',
            'body' => 'Test body',
            'is_anonymous' => false,
        ]);

        $this->assertInstanceOf(Subject::class, $discussion->discussionable);
        $this->assertEquals($this->subject->id, $discussion->discussionable->id);
    }

    public function test_discussion_morphs_to_assignment(): void
    {
        $assignment = \App\Models\Academic\Assignment::factory()->create([
            'subject_id' => $this->subject->id,
            'teacher_id' => $this->teacher->id,
        ]);

        $discussion = Discussion::create([
            'user_id' => $this->student->id,
            'discussionable_id' => $assignment->id,
            'discussionable_type' => 'assignment',
            'title' => 'Test Question',
            'body' => 'Test body',
            'is_anonymous' => false,
        ]);

        $this->assertEquals('assignment', $discussion->discussionable_type);
        $this->assertInstanceOf(\App\Models\Academic\Assignment::class, $discussion->discussionable);
    }

    public function test_discussion_has_answers(): void
    {
        $discussion = Discussion::create([
            'user_id' => $this->student->id,
            'discussionable_id' => $this->subject->id,
            'discussionable_type' => 'subject',
            'title' => 'Test Question',
            'body' => 'Test body',
            'is_anonymous' => false,
        ]);

        $answer = DiscussionAnswer::create([
            'discussion_id' => $discussion->id,
            'user_id' => $this->teacher->id,
            'body' => 'Test answer',
            'is_anonymous' => false,
        ]);

        $this->assertCount(1, $discussion->answers);
        $this->assertEquals($answer->id, $discussion->answers->first()->id);
    }

    public function test_discussion_has_votes(): void
    {
        $discussion = Discussion::create([
            'user_id' => $this->student->id,
            'discussionable_id' => $this->subject->id,
            'discussionable_type' => 'subject',
            'title' => 'Test Question',
            'body' => 'Test body',
            'is_anonymous' => false,
        ]);

        $vote = Vote::create([
            'user_id' => $this->teacher->id,
            'votable_id' => $discussion->id,
            'votable_type' => 'discussion',
            'type' => 'upvote',
        ]);

        $this->assertCount(1, $discussion->votes);
        $this->assertEquals('upvote', $discussion->votes->first()->type);
    }

    public function test_answer_has_votes(): void
    {
        $discussion = Discussion::create([
            'user_id' => $this->student->id,
            'discussionable_id' => $this->subject->id,
            'discussionable_type' => 'subject',
            'title' => 'Test Question',
            'body' => 'Test body',
            'is_anonymous' => false,
        ]);

        $answer = DiscussionAnswer::create([
            'discussion_id' => $discussion->id,
            'user_id' => $this->teacher->id,
            'body' => 'Test answer',
            'is_anonymous' => false,
        ]);

        $vote = Vote::create([
            'user_id' => $this->student->id,
            'votable_id' => $answer->id,
            'votable_type' => 'discussion_answer',
            'type' => 'upvote',
        ]);

        $this->assertCount(1, $answer->votes);
        $this->assertEquals('upvote', $answer->votes->first()->type);
    }

    public function test_subject_has_teachers(): void
    {
        $this->assertCount(1, $this->subject->teachers);
        $this->assertEquals($this->teacher->id, $this->subject->teachers->first()->id);
    }

    public function test_semester_has_students(): void
    {
        $this->assertCount(1, $this->semester->students);
        $this->assertEquals($this->student->id, $this->semester->students->first()->id);
    }
}
