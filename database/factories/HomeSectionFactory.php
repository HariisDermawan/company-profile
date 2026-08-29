<?php

namespace Database\Factories;

use App\Models\HomeSection;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<HomeSection>
 */
class HomeSectionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'section_key' => fake()->unique()->slug(2),
            'title' => fake()->sentence(4),
            'subtitle' => fake()->sentence(6),
            'description' => fake()->paragraph(),
            'image' => null,
            'data' => [
                'button_text' => fake()->word(),
                'button_url' => '#',
            ],
            'is_active' => true,
        ];
    }
}
