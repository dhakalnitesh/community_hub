<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Mentorship\MentorSession;
use App\Models\Core\User;
use App\Models\Community\Discussion;

class MentorSessionSeeder extends Seeder
{
    public function run(): void
    {
        // Assuming your existing Epic 2 seeders have created these
        $mentee = User::role('student')->first() ?? User::factory()->create(['name' => 'Junior Student']);
        $mentor = User::role('student')->skip(1)->first() ?? User::factory()->create(['name' => 'Senior Developer', 'mentor_badges_count' => 2]);
        $discussion = Discussion::first() ?? Discussion::create([
            'user_id' => $mentee->id,
            'title' => 'Struggling with Laravel Eloquent Relationships',
            'body' => 'I keep getting N+1 query issues. Can someone explain this in simple terms?',
            'is_anonymous' => true,
            'discussionable_type' => 'App\Models\Academic\Subject',
            'discussionable_id' => 1,
        ]);

        MentorSession::create([
            'discussion_id' => $discussion->id,
            'mentee_id' => $mentee->id,
            'topic' => 'Laravel Eloquent Relationships',
            'status' => 'requested',
        ]);

        MentorSession::create([
            'discussion_id' => $discussion->id, // Simplified reuse for demo
            'mentee_id' => $mentee->id,
            'mentor_id' => $mentor->id,
            'topic' => 'React Context API vs Inertia Shared Props',
            'status' => 'completed',
            'mentor_notes' => 'Explained how Inertia handles state via Ziggy and shared props. Student grasped it well.',
        ]);
    }
}