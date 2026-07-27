<?php

namespace Tests\Feature;

use App\Models\Core\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Role;

class TeacherDashboardTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Ensure roles exist
        Role::firstOrCreate(['name' => 'teacher']);
        Role::firstOrCreate(['name' => 'student']);
        Role::firstOrCreate(['name' => 'super_admin']);
        Role::firstOrCreate(['name' => 'institution_admin']);
    }

    public function test_teacher_can_access_dashboard()
    {
        $teacher = User::factory()->create(['role' => 'teacher']);
        $teacher->assignRole('teacher');

        $response = $this->actingAs($teacher)->get('/dashboard');

        $response->assertStatus(200);
        
        // Assert that inertia renders the correct component
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Dashboard')
            ->has('stats')
        );
    }
    
    public function test_non_teacher_gets_different_dashboard()
    {
        $student = User::factory()->create(['role' => 'student']);
        $student->assignRole('student');

        $response = $this->actingAs($student)->get('/dashboard');

        // Student redirects to student dashboard
        $response->assertRedirect(route('student.dashboard'));
    }
}
