<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/', 'welcome')->name('home');

Route::get('/login', function () {
    return Inertia::render('auth/Login');
})->name('login');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->name('dashboard');

Route::get('/services', function () {
    return Inertia::render('services/Index');
})->name('services');

Route::get('/profile', function () {
    return Inertia::render('Profile');
})->name('profile');

Route::get('/settings', function () {
    return Inertia::render('Settings');
})->name('settings');
