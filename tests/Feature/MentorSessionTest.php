<?php

namespace Tests\Feature;

use App\Models\Mentorship\MentorSession;
use App\Models\Core\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MentorSessionTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolesAndPermissionsSeeder::class);
    }

    public function test_mentor_board_is_accessible()
    {
        $student = User::factory()->student()->create();

        $response = $this->actingAs($student)->get(route('mentorship.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Mentorship/Board'));
    }
}
