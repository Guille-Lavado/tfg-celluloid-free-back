<?php

use Illuminate\Http\Request;
use App\Http\Controllers\Api\DirectorController;
use App\Http\Controllers\Api\GeneroController;
use App\Http\Controllers\Api\ObraController;


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

Route::get('/directores', [DirectorController::class, 'index']);
Route::get('/generos',    [GeneroController::class, 'index']);
Route::get('/obras',      [ObraController::class, 'index']);   // ?nombre=&genero=&director=

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
