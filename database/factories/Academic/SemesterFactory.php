<?php

namespace Database\Factories\Academic;

use App\Models\Academic\Semester;
use Illuminate\Database\Eloquent\Factories\Factory;

class SemesterFactory extends Factory
{
    protected $model = Semester::class;

    public function definition(): array
    {
        return [
            'name' => 'BCA ' . fake()->randomElement(['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th']) . ' Semester',
            'academic_year' => '2026',
            'invite_code' => strtoupper(fake()->bothify('???####')),
            'is_active' => true,
        ];
    }
}
