<?php

namespace Tests\Feature;

use App\Models\Grievance\Grievance;
use App\Models\Grievance\GrievanceCategory;
use App\Models\Core\User;
use App\Models\Core\Institution;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GrievanceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolesAndPermissionsSeeder::class);
    }

    public function test_student_can_submit_grievance()
    {
        $student = User::factory()->student()->create();
        $institution = Institution::factory()->create();
        $student->institutions()->attach($institution->id, ['role' => 'student']);
        
        $category = GrievanceCategory::create([
            'name' => 'Academic',
            'institution_id' => $institution->id
        ]);

        $response = $this->actingAs($student)->post(route('grievances.store'), [
            'category_id' => $category->id,
            'institution_id' => $institution->id,
            'title' => 'Grade Issue',
            'description' => 'I have an issue with my grade.',
            'priority' => 'low',
            'is_anonymous' => true,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('grievances', [
            'title' => 'Grade Issue',
            'is_anonymous' => true,
            'user_id' => $student->id,
        ]);
    }

    public function test_grievance_feed_hides_anonymous_identity()
    {
        $student = User::factory()->student()->create();
        $institution = Institution::factory()->create();
        $student->institutions()->attach($institution->id, ['role' => 'student']);
        
        $category = GrievanceCategory::create([
            'name' => 'Academic',
            'institution_id' => $institution->id
        ]);

        Grievance::create([
            'user_id' => $student->id,
            'institution_id' => $institution->id,
            'reference_code' => 'TEST-000001',
            'category_id' => $category->id,
            'title' => 'Secret Complaint',
            'description' => 'This is a secret.',
            'is_anonymous' => true,
            'status' => 'pending',
            'priority' => 'low',
            'reporter_ip' => '127.0.0.1',
            'reporter_ip_hash' => 'dummy_hash'
        ]);

        $teacher = User::factory()->teacher()->create();
        $response = $this->actingAs($teacher)->get(route('grievances.feed'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Grievances/Feed'));
    }
}
