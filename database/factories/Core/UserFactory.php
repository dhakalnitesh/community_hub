<?php

namespace Database\Factories\Core;

use App\Models\Core\User;
use App\Services\AnonymousNameGenerator;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected static ?string $password;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'role' => 'student',
            'anonymous_name' => AnonymousNameGenerator::generate(),
        ];
    }

    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    public function superAdmin(): static
    {
        return $this->state(fn (array $attributes) => ['role' => 'super_admin']);
    }

    public function institutionAdmin(): static
    {
        return $this->state(fn (array $attributes) => ['role' => 'institution_admin']);
    }

    public function teacher(): static
    {
        return $this->state(fn (array $attributes) => ['role' => 'teacher']);
    }

    public function student(): static
    {
        return $this->state(fn (array $attributes) => ['role' => 'student']);
    }
}
