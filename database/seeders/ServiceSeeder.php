<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Service::query()->delete();

        $services = [
            [
                'title' => 'Web Development',
                'slug' => 'web-development',
                'description' => 'Custom website and web application development tailored to your business needs.',
                'icon' => 'globe',
            ],
            [
                'title' => 'Mobile App Development',
                'slug' => 'mobile-app-development',
                'description' => 'Cross-platform mobile applications built for iOS and Android.',
                'icon' => 'smartphone',
            ],
            [
                'title' => 'UI/UX Design',
                'slug' => 'ui-ux-design',
                'description' => 'Modern, user-centered interface and experience design.',
                'icon' => 'pen-tool',
            ],
            [
                'title' => 'Digital Marketing',
                'slug' => 'digital-marketing',
                'description' => 'SEO, content marketing, and performance campaigns that grow your brand.',
                'icon' => 'trending-up',
            ],
        ];

        foreach ($services as $service) {
            Service::create($service);
        }
    }
}
