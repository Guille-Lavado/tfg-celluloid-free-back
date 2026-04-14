<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Videometraje;

class LikesController extends Controller
{
    // Asociar un Like a un Usuario si no lo tiene, si no, quita el Like  
    public function toggle(Request $request, $id)
    {
        $video     = Videometraje::findOrFail($id);
        $resultado = $request->user()->likes()->toggle($video->id);
        $liked     = count($resultado['attached']) > 0;
 
        return response()->json([
            'liked'       => $liked,
            'total_likes' => $video->likes()->count(),
        ], 200);

    }

    // Contar Likes que tiene un Viedo y si un Usuario tiene Like con ese Video
    public function count(Request $request, $id)
    {
        $video = Videometraje::findOrFail($id);
        $liked = $video->likes()->where('id_user', $request->user()->id)->exists();
 
        return response()->json([
            'liked'       => $liked,
            'total_likes' => $video->likes()->count(),
        ], 200);
    }
}
