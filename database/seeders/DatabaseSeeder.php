<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            CompanySeeder::class,
            HomeSectionSeeder::class,
            ServiceSeeder::class,
            ProjectSeeder::class,
            TeamSeeder::class,
            BlogSeeder::class,
            ClientSeeder::class,
            TestimonialSeeder::class,
            ContactMessageSeeder::class,
        ]);
    }
}
