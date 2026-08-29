<?php

use App\Models\BlogPost;
use App\Models\Client;
use App\Models\CompanyProfile;
use App\Models\ContactMessage;
use App\Models\HomeSection;
use App\Models\Project;
use App\Models\Service;
use App\Models\TeamMember;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('public endpoint lists team members', function () {
    TeamMember::factory()->create();

    $this->get('/api/team')
        ->assertOk()
        ->assertJsonStructure(['data']);

    expect(TeamMember::count())->toBe(1);
});

test('public endpoint lists blog posts', function () {
    BlogPost::factory()->count(3)->create();

    $this->get('/api/blog')
        ->assertOk()
        ->assertJsonCount(3, 'data');

    expect(BlogPost::count())->toBe(3);
});

test('public endpoint lists clients', function () {
    Client::factory()->count(2)->create();

    $this->get('/api/clients')
        ->assertOk()
        ->assertJsonCount(2, 'data');
});

test('public endpoint lists testimonials', function () {
    Testimonial::factory()->count(2)->create();

    $this->get('/api/testimonials')
        ->assertOk()
        ->assertJsonCount(2, 'data');
});

test('public endpoint returns latest company profile', function () {
    CompanyProfile::factory()->create([
        'name' => 'Comp Test',
    ]);

    $this->get('/api/company')
        ->assertOk()
        ->assertJsonPath('data.name', 'Comp Test');
});

test('public endpoint returns active home sections', function () {
    HomeSection::factory()->create(['section_key' => 'hero']);

    $this->get('/api/home-sections')
        ->assertOk()
        ->assertJsonCount(1, 'data');
});

test('public endpoint lists services', function () {
    Service::factory()->count(3)->create();

    $this->get('/api/services')
        ->assertOk()
        ->assertJsonCount(3, 'data');
});

test('public endpoint lists projects', function () {
    Project::factory()->count(3)->create();

    $this->get('/api/projects')
        ->assertOk()
        ->assertJsonCount(3, 'data');
});

test('public endpoint shows a single blog post', function () {
    $post = BlogPost::factory()->create();

    $this->get("/api/blog/{$post->id}")
        ->assertOk()
        ->assertJsonPath('data.id', $post->id);
});

test('anyone can submit a contact message', function () {
    $this->post('/api/contact', [
        'name' => 'Visitor',
        'email' => 'visitor@example.com',
        'subject' => 'Hello',
        'message' => 'I would like to know more about your services.',
    ])
        ->assertCreated()
        ->assertJsonPath('data.name', 'Visitor');

    expect(ContactMessage::count())->toBe(1);
});

test('guest cannot access admin endpoints', function () {
    $this->get('/api/team')->assertOk();

    $this->get('/api/admin/team')->assertUnauthorized();
    $this->post('/api/admin/team', [
        'name' => 'Fake',
        'position' => 'Dev',
    ])->assertUnauthorized();
});

test('authenticated user can create a team member', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/api/admin/team', [
            'name' => 'John Doe',
            'position' => 'Developer',
            'order' => 1,
            'is_active' => true,
        ])
        ->assertCreated()
        ->assertJsonPath('data.name', 'John Doe');

    expect(TeamMember::count())->toBe(1);
});
