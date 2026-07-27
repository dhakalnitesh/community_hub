<?php

namespace Database\Factories\Community;

use App\Models\Community\Vote;
use Illuminate\Database\Eloquent\Factories\Factory;

class VoteFactory extends Factory
{
    protected $model = Vote::class;

    public function definition(): array
    {
        return [
            'type' => fake()->randomElement(['upvote', 'downvote']),
        ];
    }

    public function upvote(): static
    {
        return $this->state(fn (array $attributes) => ['type' => 'upvote']);
    }

    public function downvote(): static
    {
        return $this->state(fn (array $attributes) => ['type' => 'downvote']);
    }
}
