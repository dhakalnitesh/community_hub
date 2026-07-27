<?php

namespace Database\Factories\Community;

use App\Models\Community\Discussion;
use Illuminate\Database\Eloquent\Factories\Factory;

class DiscussionFactory extends Factory
{
    protected $model = Discussion::class;

    public function definition(): array
    {
        return [
            'title' => fake()->sentence(6) . '?',
            'body' => fake()->paragraphs(3, true),
            'category' => fake()->randomElement(['conceptual', 'assignment', 'exam', 'career', 'technical']),
            'is_anonymous' => fake()->boolean(30),
            'status' => 'open',
        ];
    }

    public function anonymous(): static
    {
        return $this->state(fn (array $attributes) => ['is_anonymous' => true]);
    }

    public function public(): static
    {
        return $this->state(fn (array $attributes) => ['is_anonymous' => false]);
    }

    public function answered(): static
    {
        return $this->state(fn (array $attributes) => ['status' => 'answered']);
    }
}
