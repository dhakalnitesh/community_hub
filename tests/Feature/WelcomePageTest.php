<?php

namespace Tests\Feature;

use App\Models\Community\Discussion;
use App\Models\Community\DiscussionAnswer;
use App\Models\Core\Institution;
use App\Models\Academic\Semester;
use App\Models\Mentorship\StudentProject;
use App\Models\Academic\Subject;
use App\Models\Core\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class WelcomePageTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Specification: The welcome route must return HTTP 200 and render the 'Welcome' Inertia component for guest users.
     */
    public function test_welcome_page_can_be_rendered_for_guests(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Welcome')
            ->has('canLogin')
            ->has('canRegister')
            ->has('laravelVersion')
            ->has('phpVersion')
            ->where('auth.user', null)
        );
    }

    /**
     * Specification: For authenticated users, the welcome page must pass the logged-in user object in auth.user.
     */
    public function test_welcome_page_renders_correctly_for_authenticated_users(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Welcome')
            ->has('auth.user')
            ->where('auth.user.id', $user->id)
        );
    }

    /**
     * Specification: The welcome page must include platform statistics (questions, answers, projects, subjects).
     */
    public function test_welcome_page_provides_platform_stats(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Welcome')
            ->has('stats')
            ->has('stats.questions')
            ->has('stats.answers')
            ->has('stats.projects')
            ->has('stats.subjects')
        );
    }

    /**
     * Specification Driven: Live database records must accurately reflect in the statistics prop on the Welcome Page.
     */
    public function test_welcome_page_computes_accurate_live_database_statistics(): void
    {
        $user = User::factory()->create();

        // Create institution & semester for subjects
        $institution = Institution::create([
            'name' => 'GMC Tech Institute',
        ]);

        $semester = Semester::create([
            'institution_id' => $institution->id,
            'name' => 'Spring 2026',
            'academic_year' => '2025/2026',
            'invite_code' => 'SPRING2026',
            'start_date' => now(),
            'end_date' => now()->addMonths(4),
            'is_active' => true,
        ]);

        // Create subjects
        Subject::create([
            'semester_id' => $semester->id,
            'name' => 'Advanced Algorithms',
            'code' => 'CS301',
        ]);
        Subject::create([
            'semester_id' => $semester->id,
            'name' => 'Distributed Systems',
            'code' => 'CS401',
        ]);

        // Create discussion & answer
        $discussion = Discussion::create([
            'user_id' => $user->id,
            'discussionable_type' => 'general',
            'discussionable_id' => null,
            'title' => 'How to implement TDD in Laravel 12?',
            'body' => 'What are the best practices for Inertia testing?',
            'is_anonymous' => false,
        ]);

        DiscussionAnswer::create([
            'discussion_id' => $discussion->id,
            'user_id' => $user->id,
            'body' => 'Use Inertia::testing AssertableInertia helpers.',
            'is_anonymous' => false,
        ]);

        // Create student project
        StudentProject::create([
            'user_id' => $user->id,
            'institution_id' => $institution->id,
            'title' => 'Backbenchers Platform',
            'description' => 'Academic & Student Innovation Hub',
            'tech_stack' => 'Laravel, React, Tailwind',
            'github_url' => 'https://github.com/example/backbenchers',
        ]);

        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Welcome')
            ->where('stats.questions', 1)
            ->where('stats.answers', 1)
            ->where('stats.projects', 1)
            ->where('stats.subjects', 2)
        );
    }
}
