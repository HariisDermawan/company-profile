<?php

use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\BlogPostController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\CompanyProfileController;
use App\Http\Controllers\Api\ContactMessageController;
use App\Http\Controllers\Api\HomeSectionController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\TeamMemberController;
use App\Http\Controllers\Api\TestimonialController;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public API (company website)
|--------------------------------------------------------------------------
*/
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/projects', [ProjectController::class, 'index']);
Route::get('/team', [TeamMemberController::class, 'index']);
Route::get('/blog', [BlogPostController::class, 'index']);
Route::get('/blog/{post}', [BlogPostController::class, 'show']);
Route::get('/clients', [ClientController::class, 'index']);
Route::get('/testimonials', [TestimonialController::class, 'index']);
Route::get('/company', [CompanyProfileController::class, 'public']);
Route::get('/home-sections', [HomeSectionController::class, 'public']);
Route::post('/contact', [ContactMessageController::class, 'store']);

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/
Route::prefix('auth')->middleware(StartSession::class)->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});

/*
|--------------------------------------------------------------------------
| Admin API (authenticated)
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->middleware(['auth:sanctum', StartSession::class])->group(function () {
    Route::apiResource('services', ServiceController::class);
    Route::apiResource('projects', ProjectController::class);
    Route::apiResource('team', TeamMemberController::class);
    Route::apiResource('blog', BlogPostController::class);
    Route::apiResource('clients', ClientController::class);
    Route::apiResource('testimonials', TestimonialController::class);
    Route::apiResource('company', CompanyProfileController::class);
    Route::apiResource('home-sections', HomeSectionController::class);

    Route::get('contact', [ContactMessageController::class, 'index']);
    Route::get('contact/{message}', [ContactMessageController::class, 'show']);
    Route::patch('contact/{message}', [ContactMessageController::class, 'markAsRead']);
    Route::delete('contact/{message}', [ContactMessageController::class, 'destroy']);
});
