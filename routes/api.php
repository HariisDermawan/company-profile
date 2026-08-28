<?php

use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\ServiceController;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->middleware(StartSession::class)->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});

Route::middleware(['auth:sanctum', StartSession::class,])->group( function () {
        Route::apiResource('services', ServiceController::class);
    });
