<?php

namespace Database\Factories;

use App\Models\TeamMember;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TeamMember>
 */
class TeamMemberFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'position' => fake()->jobTitle(),
            'photo' => null,
            'bio' => fake()->paragraph(),
            'email' => fake()->unique()->safeEmail(),
            'linkedin_url' => 'https://linkedin.com/in/'.fake()->userName(),
            'twitter_url' => 'https://twitter.com/'.fake()->userName(),
            'order' => fake()->numberBetween(0, 20),
            'is_active' => true,
        ];
    }
}
