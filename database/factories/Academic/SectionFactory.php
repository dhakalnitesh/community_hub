<?php

namespace Database\Factories\Academic;

use App\Models\Academic\Section;
use Illuminate\Database\Eloquent\Factories\Factory;

class SectionFactory extends Factory
{
    protected $model = Section::class;

    public function definition(): array
    {
        return [
            'name' => fake()->randomElement(['A', 'B', 'C', 'Morning', 'Day', 'Evening']),
            'is_active' => true,
        ];
    }
}
