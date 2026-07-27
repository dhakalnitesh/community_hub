<?php

namespace Tests\Feature;

use App\Models\Mentorship\StudentProject;
use App\Models\Core\User;
use App\Models\Core\Institution;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectReviewTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolesAndPermissionsSeeder::class);
    }

    public function test_teacher_can_review_and_endorse_project()
    {
        $institution = Institution::factory()->create();
        
        $student = User::factory()->student()->create();
        $student->institutions()->attach($institution->id, ['role' => 'student']);
        
        $project = StudentProject::create([
            'user_id' => $student->id,
            'institution_id' => $institution->id,
            'title' => 'Awesome System',
            'description' => 'A great platform.',
            'tech_stack' => 'Laravel, React',
        ]);

        $teacher = User::factory()->teacher()->create();
        $teacher->assignRole('teacher');

        // Check initial reputation
        $this->assertEquals(0, $student->reputation);

        $response = $this->actingAs($teacher)->post(route('projects.reviews.store', $project), [
            'content' => 'This is an excellent project. Keep it up!',
            'is_endorsed' => true,
        ]);

        $response->assertRedirect();
        
        $this->assertDatabaseHas('project_reviews', [
            'student_project_id' => $project->id,
            'user_id' => $teacher->id,
            'is_endorsed' => true,
        ]);

        // Reputation should increase by 20 because of the event listener
        $this->assertEquals(20, $student->fresh()->reputation);
    }

    public function test_student_cannot_review_projects()
    {
        $institution = Institution::factory()->create();
        
        $student1 = User::factory()->student()->create();
        $student1->institutions()->attach($institution->id, ['role' => 'student']);
        $student1->assignRole('student');
        
        $project = StudentProject::create([
            'user_id' => $student1->id,
            'institution_id' => $institution->id,
            'title' => 'Awesome System',
            'description' => 'A great platform.',
            'tech_stack' => 'Laravel, React',
        ]);

        $student2 = User::factory()->student()->create();
        $student2->assignRole('student');

        $response = $this->actingAs($student2)->post(route('projects.reviews.store', $project), [
            'content' => 'Nice work bro!',
            'is_endorsed' => false,
        ]);

        $response->assertForbidden();
    }
}
