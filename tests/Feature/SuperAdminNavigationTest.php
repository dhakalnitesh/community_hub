<?php

namespace Tests\Feature;

use App\Models\Core\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SuperAdminNavigationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        \Spatie\Permission\Models\Role::create(['name' => 'super_admin']);
        \Spatie\Permission\Models\Role::create(['name' => 'student']);
        \Spatie\Permission\Models\Role::create(['name' => 'institution_admin']);
        
        $this->superAdmin = User::factory()->create(['role' => 'super_admin']);
        $this->superAdmin->assignRole('super_admin');
        
        $this->student = User::factory()->create(['role' => 'student']);
        $this->student->assignRole('student');
        
        $this->institutionAdmin = User::factory()->create(['role' => 'institution_admin']);
        $this->institutionAdmin->assignRole('institution_admin');
    }

    public function test_super_admin_can_access_institution_admins_page()
    {
        $response = $this->actingAs($this->superAdmin)->get(route('admin.institution_admins'));
        $response->assertStatus(200);
    }

    public function test_super_admin_can_access_analytics_page()
    {
        $response = $this->actingAs($this->superAdmin)->get(route('admin.analytics'));
        $response->assertStatus(200);
    }

    public function test_super_admin_can_access_monitoring_page()
    {
        $response = $this->actingAs($this->superAdmin)->get(route('admin.monitoring'));
        $response->assertStatus(200);
    }

    public function test_super_admin_can_access_roles_page()
    {
        $response = $this->actingAs($this->superAdmin)->get(route('admin.roles'));
        $response->assertStatus(200);
    }

    public function test_super_admin_can_access_reports_page()
    {
        $response = $this->actingAs($this->superAdmin)->get(route('admin.reports'));
        $response->assertStatus(200);
    }

    public function test_non_super_admins_cannot_access_new_admin_pages()
    {
        $routes = [
            route('admin.institution_admins'),
            route('admin.analytics'),
            route('admin.monitoring'),
            route('admin.roles'),
            route('admin.reports'),
        ];

        foreach ($routes as $route) {
            $response = $this->actingAs($this->student)->get($route);
            $response->assertStatus(403);
            
            $response = $this->actingAs($this->institutionAdmin)->get($route);
            $response->assertStatus(403);
        }
    }

    public function test_unauthenticated_users_are_redirected_to_login()
    {
        $routes = [
            route('admin.institution_admins'),
            route('admin.analytics'),
            route('admin.monitoring'),
            route('admin.roles'),
            route('admin.reports'),
        ];

        foreach ($routes as $route) {
            $response = $this->get($route);
            $response->assertRedirect(route('login'));
        }
    }
}
