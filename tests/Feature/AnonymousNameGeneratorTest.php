<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Services\AnonymousNameGenerator;
use Tests\TestCase;

class AnonymousNameGeneratorTest extends TestCase
{
    use RefreshDatabase;
    public function test_generates_valid_format(): void
    {
        $name = AnonymousNameGenerator::generate();

        $this->assertMatchesRegularExpression('/^[A-Z][a-z]+[A-Z][a-z]+\d{2}$/', $name);
    }

    public function test_generates_unique_names(): void
    {
        $names = [];

        for ($i = 0; $i < 50; $i++) {
            $names[] = AnonymousNameGenerator::generate();
        }

        $this->assertCount(50, array_unique($names));
    }

    public function test_no_vulgar_or_inappropriate_words(): void
    {
        $vulgarWords = ['fuck', 'shit', 'damn', 'ass', 'bitch', 'crap', 'dick', 'piss'];

        for ($i = 0; $i < 50; $i++) {
            $name = strtolower(AnonymousNameGenerator::generate());
            foreach ($vulgarWords as $vulgar) {
                $this->assertStringNotContainsString($vulgar, $name);
            }
        }
    }

    public function test_adjective_animal_pattern(): void
    {
        $names = [];
        for ($i = 0; $i < 50; $i++) {
            $names[] = AnonymousNameGenerator::generate();
        }

        foreach ($names as $name) {
            $this->assertMatchesRegularExpression('/^[A-Z][a-z]+[A-Z][a-z]+\d{2}$/', $name);
            $this->assertGreaterThanOrEqual(8, strlen($name));
            $this->assertLessThanOrEqual(25, strlen($name));
        }
    }

    public function test_generated_name_is_appropriate_length(): void
    {
        $name = AnonymousNameGenerator::generate();
        $this->assertGreaterThanOrEqual(6, strlen($name));
        $this->assertLessThanOrEqual(25, strlen($name));
    }
}
