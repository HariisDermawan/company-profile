<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Project::query()->delete();

        $projects = [
            [
                'title' => 'E-Commerce Platform',
                'slug' => 'e-commerce-platform',
                'description' => 'Full-featured online store with payments, inventory, and analytics.',
                'category' => 'Web',
                'client' => 'Acme Retail',
                'project_url' => 'https://example.com',
                'is_featured' => true,
            ],
            [
                'title' => 'Corporate Website',
                'slug' => 'corporate-website',
                'description' => 'Modern corporate website with CMS for the company profile.',
                'category' => 'Web',
                'client' => 'Globex Corp',
                'project_url' => 'https://example.com',
                'is_featured' => true,
            ],
            [
                'title' => 'Mobile Banking App',
                'slug' => 'mobile-banking-app',
                'description' => 'Secure mobile banking application for iOS and Android.',
                'category' => 'Mobile',
                'client' => 'Finbank',
                'project_url' => 'https://example.com',
                'is_featured' => false,
            ],
        ];

        foreach ($projects as $project) {
            Project::create($project);
        }
    }
}
