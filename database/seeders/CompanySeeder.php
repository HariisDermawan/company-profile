<?php

namespace Database\Seeders;

use App\Models\CompanyProfile;
use Illuminate\Database\Seeder;

class CompanySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        CompanyProfile::query()->delete();

        CompanyProfile::factory()->create([
            'name' => 'Company Profile',
            'tagline' => 'Building ideas into reality',
            'about' => 'We are a creative technology company helping brands grow through web, mobile, and digital experiences.',
        ]);
    }
}
