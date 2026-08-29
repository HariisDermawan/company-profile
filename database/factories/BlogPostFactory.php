<?php

namespace Database\Factories;

use App\Models\BlogPost;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<BlogPost>
 */
class BlogPostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->sentence(6);

        return [
            'title' => $title,
            'slug' => Str::slug($title).'-'.fake()->unique()->numberBetween(1, 1000),
            'excerpt' => fake()->paragraph(),
            'content' => fake()->paragraphs(5, true),
            'cover_image' => null,
            'category' => fake()->randomElement(['News', 'Insight', 'Update']),
            'tags' => [fake()->word(), fake()->word()],
            'author' => fake()->name(),
            'published_at' => now(),
            'is_active' => true,
        ];
    }
}
