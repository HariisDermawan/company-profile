<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/', 'welcome')->name('home');

Route::middleware('guest')->get('/login', function () {
    return Inertia::render('auth/Login');
})->name('login');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('/services', function () {
        return Inertia::render('services/Index');
    })->name('services');

    Route::get('/services/create', function () {
        return Inertia::render('services/Create');
    })->name('services.create');

    Route::get('/services/{service}/edit', function (int $service) {
        return Inertia::render('services/Edit', ['id' => $service]);
    })->name('services.edit');

    Route::get('/profile', function () {
        return Inertia::render('Profile');
    })->name('profile');

    Route::get('/settings', function () {
        return Inertia::render('Settings');
    })->name('settings');

    Route::get('/projects', function () {
        return Inertia::render('projects/Index');
    })->name('projects');

    Route::get('/projects/create', function () {
        return Inertia::render('projects/Create');
    })->name('projects.create');

    Route::get('/projects/{project}/edit', function (int $project) {
        return Inertia::render('projects/Edit', ['id' => $project]);
    })->name('projects.edit');

    Route::get('/team', function () {
        return Inertia::render('team/Index');
    })->name('team');

    Route::get('/team/create', function () {
        return Inertia::render('team/Create');
    })->name('team.create');

    Route::get('/team/{member}/edit', function (int $member) {
        return Inertia::render('team/Edit', ['id' => $member]);
    })->name('team.edit');

    Route::get('/blog', function () {
        return Inertia::render('blog/Index');
    })->name('blog');

    Route::get('/blog/create', function () {
        return Inertia::render('blog/Create');
    })->name('blog.create');

    Route::get('/blog/{post}/edit', function (int $post) {
        return Inertia::render('blog/Edit', ['id' => $post]);
    })->name('blog.edit');

    Route::get('/clients', function () {
        return Inertia::render('clients/Index');
    })->name('clients');

    Route::get('/clients/create', function () {
        return Inertia::render('clients/Create');
    })->name('clients.create');

    Route::get('/clients/{client}/edit', function (int $client) {
        return Inertia::render('clients/Edit', ['id' => $client]);
    })->name('clients.edit');

    Route::get('/testimonials', function () {
        return Inertia::render('testimonials/Index');
    })->name('testimonials');

    Route::get('/testimonials/create', function () {
        return Inertia::render('testimonials/Create');
    })->name('testimonials.create');

    Route::get('/testimonials/{testimonial}/edit', function (int $testimonial) {
        return Inertia::render('testimonials/Edit', ['id' => $testimonial]);
    })->name('testimonials.edit');

    Route::get('/company', function () {
        return Inertia::render('company/Index');
    })->name('company');

    Route::get('/company/{profile}/edit', function (int $profile) {
        return Inertia::render('company/Edit', ['id' => $profile]);
    })->name('company.edit');

    Route::get('/home-sections', function () {
        return Inertia::render('home-sections/Index');
    })->name('home-sections');

    Route::get('/home-sections/create', function () {
        return Inertia::render('home-sections/Create');
    })->name('home-sections.create');

    Route::get('/home-sections/{section}/edit', function (int $section) {
        return Inertia::render('home-sections/Edit', ['id' => $section]);
    })->name('home-sections.edit');

    Route::get('/contact', function () {
        return Inertia::render('contact/Index');
    })->name('contact');

    Route::get('/contact/{message}', function (int $message) {
        return Inertia::render('contact/Show', ['id' => $message]);
    })->name('contact.show');
});
