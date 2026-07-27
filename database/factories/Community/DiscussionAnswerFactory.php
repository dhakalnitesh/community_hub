<?php

namespace Database\Factories\Community;

use App\Models\Community\DiscussionAnswer;
use Illuminate\Database\Eloquent\Factories\Factory;

class DiscussionAnswerFactory extends Factory
{
    protected $model = DiscussionAnswer::class;

    public function definition(): array
    {
        return [
            'body' => fake()->paragraphs(2, true),
            'is_anonymous' => false,
            'is_accepted' => false,
        ];
    }

    public function accepted(): static
    {
        return $this->state(fn (array $attributes) => ['is_accepted' => true]);
    }

    public function anonymous(): static
    {
        return $this->state(fn (array $attributes) => ['is_anonymous' => true]);
    }

    public function public(): static
    {
        return $this->state(fn (array $attributes) => ['is_anonymous' => false]);
    }
}
