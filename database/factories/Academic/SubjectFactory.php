<?php

namespace Database\Factories\Academic;

use App\Models\Academic\Subject;
use Illuminate\Database\Eloquent\Factories\Factory;

class SubjectFactory extends Factory
{
    protected $model = Subject::class;

    public function definition(): array
    {
        $subjects = ['Java Programming', 'Digital Logic', 'Data Structures', 'Database Systems', 'Web Technology', 'Computer Networks', 'Operating Systems', 'Software Engineering'];

        return [
            'name' => fake()->randomElement($subjects),
            'code' => strtoupper(fake()->bothify('BCA###')),
            'description' => fake()->sentence(),
            'is_active' => true,
        ];
    }
}
