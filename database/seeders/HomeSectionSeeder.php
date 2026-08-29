<?php

namespace Database\Seeders;

use App\Models\HomeSection;
use Illuminate\Database\Seeder;

class HomeSectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        HomeSection::query()->delete();

        $sections = [
            'hero' => [
                'title' => 'Let’s Build Something Great',
                'subtitle' => 'Modern digital solutions for growing businesses',
                'description' => 'We design and build websites, applications, and digital experiences that help your company stand out.',
                'data' => [
                    'button_text' => 'Our Services',
                    'button_url' => '/services',
                ],
            ],
            'about' => [
                'title' => 'About Our Company',
                'subtitle' => 'Who we are',
                'description' => 'A dedicated team of designers and developers committed to delivering high-quality digital products.',
            ],
            'cta' => [
                'title' => 'Ready to start your project?',
                'subtitle' => 'Let’s talk about your goals',
                'data' => [
                    'button_text' => 'Contact Us',
                    'button_url' => '/contact',
                ],
            ],
        ];

        foreach ($sections as $key => $section) {
            HomeSection::create([
                'section_key' => $key,
                ...$section,
            ]);
        }
    }
}
