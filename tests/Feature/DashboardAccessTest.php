<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page when accessing the dashboard', function () {
    $this->get(route('dashboard'))->assertRedirect(route('login'));
});

test('guests are redirected to the login page when accessing protected admin pages', function (string $uri) {
    $this->get($uri)->assertRedirect(route('login'));
})->with([
    'services' => fn () => route('services'),
    'services.create' => fn () => route('services.create'),
    'profile' => fn () => route('profile'),
    'settings' => fn () => route('settings'),
    'projects' => fn () => route('projects'),
]);

test('authenticated users can access the dashboard', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('Dashboard'));
});
