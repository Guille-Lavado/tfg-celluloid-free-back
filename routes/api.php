<?php

use Illuminate\Http\Request;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DirectorController;
use App\Http\Controllers\Api\GeneroController;
use App\Http\Controllers\Api\ObraController;
use App\Http\Controllers\Api\PuntuacionController;
use App\Http\Controllers\Api\ComentarioController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// --- Generos --- 
Route::get('/generos',         [GeneroController::class, 'index']);
Route::post('/generos',        [GeneroController::class, 'store']);
Route::put('/generos/{id}',    [GeneroController::class, 'update']);
Route::delete('/generos/{id}', [GeneroController::class, 'destroy']);

// --- Obras --- 
Route::get('/obras',      [ObraController::class, 'index']);   // ?nombre=&genero=&director=
Route::get('/obras/{id}', [ObraController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // --- Directores --- 
    Route::get('/directores',      [DirectorController::class, 'index']);
    Route::get('/directores/{id}', [DirectorController::class, 'show']);

    // --- Puntuaciones ---
    Route::get('/puntuaciones/{id}',    [PuntuacionController::class, 'show']);
    Route::post('/puntuaciones/{id}',   [PuntuacionController::class, 'toggle']);
    Route::delete('/puntuaciones/{id}', [PuntuacionController::class, 'destroy']);

    // --- Comentarios ---
    Route::get('/videos/{id}/comentarios',  [ComentarioController::class, 'index']);
    Route::post('/videos/{id}/comentarios', [ComentarioController::class, 'store']);
    Route::delete('/comentarios/{id}',      [ComentarioController::class, 'destroy']);

    // Favoritos
    Route::get('/favoritos/obras',            [FavoritoController::class, 'obras']);
    Route::post('/favoritos/obras/{id}',      [FavoritoController::class, 'toggleObra']);
    Route::get('/favoritos/directores',       [FavoritoController::class, 'directores']);
    Route::post('/favoritos/directores/{id}', [FavoritoController::class, 'toggleDirector']);
});
