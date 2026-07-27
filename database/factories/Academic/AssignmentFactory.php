<?php

namespace Database\Factories\Academic;

use App\Models\Academic\Assignment;
use Illuminate\Database\Eloquent\Factories\Factory;

class AssignmentFactory extends Factory
{
    protected $model = Assignment::class;

    public function definition(): array
    {
        return [
            'title' => fake()->sentence(4),
            'description' => fake()->paragraph(),
            'max_score' => fake()->randomElement([50, 75, 100]),
            'due_date' => fake()->dateTimeBetween('+1 day', '+2 weeks'),
            'allow_late_submission' => fake()->boolean(),
        ];
    }
}
