<?php

namespace Database\Factories\Core;

use App\Models\Core\Institution;
use Illuminate\Database\Eloquent\Factories\Factory;

class InstitutionFactory extends Factory
{
    protected $model = Institution::class;

    public function definition(): array
    {
        return [
            'name' => fake()->company() . ' College',
            'type' => 'college',
            'address' => fake()->address(),
            'is_active' => true,
        ];
    }
}
