<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Mentorship\StudentProject;
use App\Models\Core\User;
use App\Models\Core\Institution;

class StudentProjectSeeder extends Seeder
{
    public function run(): void
    {
        $student = User::role('student')->first() ?? User::factory()->create();
        $institution = Institution::first() ?? Institution::factory()->create(['name' => 'Gomendra Multiple Campus']);

        $projects = [
            [
                'title' => 'AgriConnect: IoT for Koshi Farmers',
                'description' => 'A hardware-software bridge using ESP32 sensors to monitor soil moisture and predict crop yields using a Laravel backend and Python ML microservice.',
                'tech_stack' => 'Laravel, React, C++, Python',
                'github_url' => 'https://github.com/example/agriconnect',
                'live_demo_url' => 'https://agriconnect.demo',
                'status' => 'published',
            ],
            [
                'title' => 'Nepali NLP Sentiment Analyzer',
                'description' => 'A machine learning model trained to detect cyberbullying and toxic comments written in Romanized Nepali and Devanagari script.',
                'tech_stack' => 'Python, TensorFlow, FastAPI',
                'github_url' => 'https://github.com/example/nepali-nlp',
                'live_demo_url' => null,
                'status' => 'published',
            ],
        ];

        foreach ($projects as $project) {
            StudentProject::create(array_merge($project, [
                'user_id' => $student->id,
                'institution_id' => $institution->id,
            ]));
        }
    }
}
