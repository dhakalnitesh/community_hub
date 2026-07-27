<?php

namespace Tests\Feature;

use App\Models\StudentProject;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StudentProjectTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolesAndPermissionsSeeder::class);
    }

    public function test_student_can_submit_project()
    {
        $student = User::factory()->student()->create();
        $institution = \App\Models\Institution::factory()->create();
        $student->institutions()->attach($institution->id, ['role' => 'student']);

        $response = $this->actingAs($student)->post(route('projects.store'), [
            'title' => 'My Cool AI App',
            'description' => 'This is an AI app.',
            'tech_stack' => 'React, Laravel',
            'github_url' => 'https://github.com/test/app',
        ]);

        $response->assertRedirect(route('projects.index'));
        $this->assertDatabaseHas('student_projects', [
            'title' => 'My Cool AI App',
            'user_id' => $student->id,
        ]);
    }

    public function test_showcase_lists_projects()
    {
        $student = User::factory()->student()->create();
        $institution = \App\Models\Institution::factory()->create();
        $student->institutions()->attach($institution->id, ['role' => 'student']);

        StudentProject::create([
            'user_id' => $student->id,
            'institution_id' => $institution->id,
            'title' => 'Demo Project',
            'description' => 'Testing showcase',
            'tech_stack' => 'Laravel, React',
        ]);

        $response = $this->actingAs($student)->get(route('projects.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Projects/Showcase'));
    }
}
