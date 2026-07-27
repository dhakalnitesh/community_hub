<?php

namespace App\Services;

class AnonymousNameGenerator
{
    private static array $adjectives = [
        'Curious', 'Bright', 'Sharp', 'Quick', 'Wise', 'Calm', 'Brave', 'Gentle',
        'Keen', 'Swift', 'Clever', 'Bold', 'Eager', 'Focused', 'Active', 'Lively',
        'Patient', 'Steady', 'Kinder', 'Polite', 'Honest', 'Loyal', 'Warm', 'Merry',
        'Silent', 'Radiant', 'Starlight', 'Noble', 'Agile', 'Vibrant', 'Cosmic', 'Solar',
        'Crystal', 'Golden', 'Silver', 'Amber', 'Emerald', 'Ruby', 'Sapphire', 'Topaz',
    ];

    private static array $animals = [
        'Fox', 'Owl', 'Panda', 'Tiger', 'Eagle', 'Dolphin', 'Bear', 'Wolf',
        'Falcon', 'Rabbit', 'Deer', 'Robin', 'Lark', 'Otter', 'Seal', 'Koala',
        'Crane', 'Lynx', 'Phoenix', 'Hawk', 'Finch', 'Dove', 'Swan', 'Heron',
        'Panther', 'Jaguar', 'Leopard', 'Cheetah', 'Badger', 'Bison', 'Condor', 'Raven',
        'Osprey', 'Plover', 'Viper', 'Mongoose', 'Beaver', 'Walrus', 'Puffin', 'Oriole',
    ];

    public static function generate(): string
    {
        $attempts = 0;
        $maxAttempts = 50;

        do {
            $adjective = self::$adjectives[array_rand(self::$adjectives)];
            $animal = self::$animals[array_rand(self::$animals)];
            $number = str_pad(random_int(1, 99), 2, '0', STR_PAD_LEFT);
            $name = $adjective . $animal . $number;
            $attempts++;
            
            if ($attempts >= $maxAttempts) {
                $name .= '-' . substr(uniqid(), -4);
                break;
            }
        } while (\App\Models\Core\User::where('anonymous_name', $name)->exists());

        return $name;
    }
}
