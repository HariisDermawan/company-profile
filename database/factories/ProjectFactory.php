<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->unique()->words(4, true);

        return [
            'title' => ucfirst($title),
            'slug' => Str::slug($title),
            'description' => fake()->paragraph(),
            'image' => null,
            'category' => fake()->randomElement(['Web', 'Mobile', 'Design']),
            'client' => fake()->company(),
            'project_url' => 'https://'.fake()->domainName(),
            'is_featured' => fake()->boolean(),
            'is_active' => true,
        ];
    }
}
