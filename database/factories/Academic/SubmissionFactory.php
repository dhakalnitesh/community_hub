<?php

namespace Database\Factories\Academic;

use App\Models\Academic\Submission;
use Illuminate\Database\Eloquent\Factories\Factory;

class SubmissionFactory extends Factory
{
    protected $model = Submission::class;

    public function definition(): array
    {
        return [
            'content' => fake()->paragraph(),
            'status' => 'submitted',
            'is_late' => false,
        ];
    }

    public function graded(): static
    {
        return $this->state(fn (array $attributes) => [
            'score' => fake()->numberBetween(0, $attributes['max_score'] ?? 100),
            'feedback' => fake()->sentence(),
            'status' => 'graded',
        ]);
    }

    public function late(): static
    {
        return $this->state(fn (array $attributes) => ['is_late' => true]);
    }
}
