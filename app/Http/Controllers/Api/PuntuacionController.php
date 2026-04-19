<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Videometraje;
use App\Models\Puntuacion;

class PuntuacionController extends Controller
{
    // Crea o actualiza la puntuación del usuario para un video 
    public function toggle(Request $request, int $id)
    {
        $video = Videometraje::findOrFail($id);

        $data = $request->validate([
            'valor' => 'required|integer|min:1|max:5',
        ]);

        $puntuacion = Puntuacion::updateOrCreate(
            [
                'id_user'  => $request->user()->id,
                'id_video' => $id,
            ], [
                'valor' => $request->valor
            ]
        );

        return response()->json([
            'media'       => round($video->puntuaciones()->avg('valor'), 1),
            'total_votos' => $video->puntuaciones()->count(),
        ], 200);
    }

    // Devuelve la media, el total de votos y la puntuación del usuario autenticado
    public function show(Request $request, int $id)
    {
        $video = Videometraje::findOrFail($id);
 
        $miPuntuacion = $request->user()
            ->puntuaciones()
            ->where('id_video', $id)
            ->first();
 
        return response()->json([
            'media'           => round($video->puntuaciones()->avg('valor'), 1),
            'total_votos'     => $video->puntuaciones()->count(),
            'mi_puntuacion'   => $miPuntuacion ? $miPuntuacion->pivot->valor : null,
        ], 200);
    }

    // Elimina la puntuación del usuario para un video
    public function destroy(Request $request, int $id)
    {
        $video = Videometraje::findOrFail($id);
 
        $request->user()->puntuaciones()->detach($video->id);
 
        return response()->json(['message' => 'Puntuación eliminada correctamente'], 200);
    }
}
