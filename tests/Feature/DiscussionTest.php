<?php

namespace Tests\Feature;

use App\Models\Community\Discussion;
use App\Models\Core\Institution;
use App\Models\Academic\Section;
use App\Models\Academic\Semester;
use App\Models\Academic\Subject;
use App\Models\Core\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DiscussionTest extends TestCase
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
    private Discussion $discussionJava;
    private Discussion $discussionDL;

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
        // StudentJava is enrolled in the semester, so can see both subjects

        $this->studentDL = User::factory()->student()->create();
        $this->studentDL->assignRole('student');

        $this->superAdmin = User::factory()->superAdmin()->create();
        $this->superAdmin->assignRole('super_admin');

        $this->instAdmin = User::factory()->institutionAdmin()->create();
        $this->instAdmin->assignRole('institution_admin');
        $institution->users()->attach($this->instAdmin->id, ['role' => 'institution_admin']);

        $this->discussionJava = Discussion::factory()->public()->create([
            'user_id' => $this->studentJava->id,
            'discussionable_id' => $this->javaSubject->id,
            'discussionable_type' => 'subject',
        ]);

        $this->discussionDL = Discussion::factory()->public()->create([
            'user_id' => $this->studentDL->id,
            'discussionable_id' => $this->dlSubject->id,
            'discussionable_type' => 'subject',
        ]);
    }

    // === Authentication ===

    public function test_guest_cannot_view_questions(): void
    {
        $this->get(route('questions.index'))->assertRedirect(route('login'));
        $this->get(route('questions.create'))->assertRedirect(route('login'));
    }

    public function test_guest_cannot_view_single_question(): void
    {
        $this->get(route('questions.show', $this->discussionJava))
            ->assertRedirect(route('login'));
    }

    // === Scope Isolation: Teacher ===

    public function test_teacher_sees_only_their_subject_questions(): void
    {
        $response = $this->actingAs($this->teacherJava)
            ->get(route('questions.index'));
        $response->dump();

        $response->assertInertia(fn ($page) => $page
            ->component('Questions/Index')
            ->has('discussions.data', 1)
            ->where('discussions.data.0.id', $this->discussionJava->id)
        );
    }

    public function test_teacher_cannot_see_other_subject_questions(): void
    {
        $response = $this->actingAs($this->teacherDL)
            ->get(route('questions.index'));

        $response->assertInertia(fn ($page) => $page
            ->component('Questions/Index')
            ->has('discussions.data', 1)
            ->where('discussions.data.0.id', $this->discussionDL->id)
        );
    }

    public function test_teacher_cannot_view_question_from_other_subject(): void
    {
        $this->actingAs($this->teacherJava)
            ->get(route('questions.show', $this->discussionDL))
            ->assertForbidden();
    }

    // === Scope Isolation: SuperAdmin ===

    public function test_super_admin_sees_all_questions(): void
    {
        $response = $this->actingAs($this->superAdmin)
            ->get(route('questions.index'));

        $response->assertInertia(fn ($page) => $page
            ->component('Questions/Index')
            ->has('discussions.data', 2)
        );
    }

    // === CRUD: Create ===

    public function test_student_can_create_discussion(): void
    {
        $response = $this->actingAs($this->studentJava)
            ->post(route('questions.store'), [
                'discussionable_type' => 'subject',
                'discussionable_id' => $this->javaSubject->id,
                'title' => 'What is polymorphism?',
                'body' => 'I am confused about compile-time vs runtime polymorphism.',
                'is_anonymous' => false,
            ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('discussions', [
            'title' => 'What is polymorphism?',
            'user_id' => $this->studentJava->id,
            'is_anonymous' => false,
        ]);
    }

    public function test_teacher_can_create_discussion(): void
    {
        $this->actingAs($this->teacherJava)
            ->post(route('questions.store'), [
                'discussionable_type' => 'subject',
                'discussionable_id' => $this->javaSubject->id,
                'title' => 'Important announcement about exam',
                'body' => 'Please check the syllabus.',
                'is_anonymous' => false,
            ])
            ->assertRedirect();
    }

    public function test_anonymous_discussion_stores_anonymously(): void
    {
        $this->actingAs($this->studentJava)
            ->post(route('questions.store'), [
                'discussionable_type' => 'subject',
                'discussionable_id' => $this->javaSubject->id,
                'title' => 'Anonymous question',
                'body' => 'This should be anonymous.',
                'is_anonymous' => true,
            ])
            ->assertRedirect();

        $discussion = Discussion::where('title', 'Anonymous question')->first();
        $this->assertTrue($discussion->is_anonymous);
        $this->assertEquals($this->studentJava->id, $discussion->user_id);
    }

    public function test_create_discussion_requires_title(): void
    {
        $this->actingAs($this->studentJava)
            ->post(route('questions.store'), [
                'discussionable_type' => 'subject',
                'discussionable_id' => $this->javaSubject->id,
                'title' => '',
                'body' => 'Some body',
                'is_anonymous' => false,
            ])
            ->assertSessionHasErrors('title');
    }

    public function test_create_discussion_requires_body(): void
    {
        $this->actingAs($this->studentJava)
            ->post(route('questions.store'), [
                'discussionable_type' => 'subject',
                'discussionable_id' => $this->javaSubject->id,
                'title' => 'Title only',
                'body' => '',
                'is_anonymous' => false,
            ])
            ->assertSessionHasErrors('body');
    }

    public function test_create_discussion_title_max_length(): void
    {
        $this->actingAs($this->studentJava)
            ->post(route('questions.store'), [
                'discussionable_type' => 'subject',
                'discussionable_id' => $this->javaSubject->id,
                'title' => str_repeat('a', 256),
                'body' => 'Valid body',
                'is_anonymous' => false,
            ])
            ->assertSessionHasErrors('title');
    }

    public function test_guest_cannot_create_discussion(): void
    {
        $this->post(route('questions.store'), [
            'discussionable_type' => 'subject',
            'discussionable_id' => 1,
            'title' => 'Should not work',
            'body' => 'Guest cannot post',
        ])->assertRedirect(route('login'));
    }

    // === CRUD: Update ===

    public function test_author_can_update_own_discussion(): void
    {
        $this->actingAs($this->studentJava)
            ->put(route('questions.update', $this->discussionJava), [
                'title' => 'Updated title',
                'body' => 'Updated body',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('discussions', [
            'id' => $this->discussionJava->id,
            'title' => 'Updated title',
        ]);
    }

    public function test_other_user_cannot_update_discussion(): void
    {
        $this->actingAs($this->studentDL)
            ->put(route('questions.update', $this->discussionJava), [
                'title' => 'Hacked title',
                'body' => 'Hacked body',
            ])
            ->assertForbidden();
    }

    // === CRUD: Delete ===

    public function test_author_can_delete_own_discussion(): void
    {
        $this->actingAs($this->studentJava)
            ->delete(route('questions.destroy', $this->discussionJava))
            ->assertRedirect();

        $this->assertSoftDeleted($this->discussionJava);
    }

    public function test_teacher_can_delete_discussion_in_their_subject(): void
    {
        $this->actingAs($this->teacherJava)
            ->delete(route('questions.destroy', $this->discussionJava))
            ->assertRedirect();
    }

    public function test_teacher_cannot_delete_discussion_in_other_subject(): void
    {
        $this->actingAs($this->teacherJava)
            ->delete(route('questions.destroy', $this->discussionDL))
            ->assertForbidden();
    }

    public function test_other_student_cannot_delete_discussion(): void
    {
        $this->actingAs($this->studentDL)
            ->delete(route('questions.destroy', $this->discussionJava))
            ->assertForbidden();
    }

    // === Anonymous Identity ===

    public function test_anonymous_discussion_shows_anonymous_name(): void
    {
        $anonDiscussion = Discussion::factory()->create([
            'user_id' => $this->studentJava->id,
            'discussionable_id' => $this->javaSubject->id,
            'discussionable_type' => 'subject',
            'is_anonymous' => true,
        ]);

        $this->assertEquals(
            $this->studentJava->anonymous_name,
            $anonDiscussion->author_name
        );
    }

    public function test_public_discussion_shows_real_name(): void
    {
        $this->assertEquals(
            $this->studentJava->name,
            $this->discussionJava->author_name
        );
    }

    // === Inertia Page Rendering ===

    public function test_questions_index_page_renders(): void
    {
        $this->actingAs($this->superAdmin)
            ->get(route('questions.index'))
            ->assertInertia(fn ($page) => $page
                ->component('Questions/Index')
                ->has('discussions')
                ->has('filters')
            );
    }

    public function test_questions_show_page_renders(): void
    {
        $this->actingAs($this->superAdmin)
            ->get(route('questions.show', $this->discussionJava))
            ->assertInertia(fn ($page) => $page
                ->component('Questions/Show')
                ->has('discussion')
            );
    }

    public function test_questions_create_page_renders(): void
    {
        $this->actingAs($this->studentJava)
            ->get(route('questions.create'))
            ->assertInertia(fn ($page) => $page
                ->component('Questions/Create')
                ->has('subjects')
            );
    }

    // === Empty State ===

    public function test_empty_questions_list(): void
    {
        Discussion::query()->delete();

        $this->actingAs($this->superAdmin)
            ->get(route('questions.index'))
            ->assertInertia(fn ($page) => $page
                ->component('Questions/Index')
                ->has('discussions.data', 0)
            );
    }
}
