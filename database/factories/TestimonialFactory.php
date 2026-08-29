<?php

namespace Database\Factories;

use App\Models\Testimonial;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Testimonial>
 */
class TestimonialFactory extends Factory
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
            'company' => fake()->company(),
            'position' => fake()->jobTitle(),
            'photo' => null,
            'content' => fake()->paragraphs(2, true),
            'rating' => fake()->numberBetween(4, 5),
            'is_active' => true,
        ];
    }
}
