<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class FavoritoController extends Controller
{
   // Mostrar Obras favoritas de un Usuario
    public function obras(Request $request)
    {
        $favoritos = $request->user()
            ->favoritosObra()
            ->with(['genero', 'director'])
            ->get();
 
        return response()->json($favoritos, 200);
    }
 
    // Alterna el estado de la relación entre una Obra y el Usuaio 
    public function toggleObra(Request $request, Obra $obra)
    {
        $resultado = $request->user()->favoritosObra()->toggle($obra->id);
        $added     = count($resultado['attached']) > 0;
 
        return response()->json([
            'favorito' => $added,
            'obra_id'  => $obra->id,
        ], 200);
    }
 
    // Mostrar Directores favoritas de un Usuario
    public function directores(Request $request)
    {
        $favoritos = $request->user()
            ->favoritosDirector()
            ->get();
 
        return response()->json($favoritos, 200);
    }
 
    // Alterna el estado de la relación entre un Director y el Usuaio
    public function toggleDirector(Request $request, Director $director)
    {
        $resultado  = $request->user()->favoritosDirector()->toggle($director->id);
        $added      = count($resultado['attached']) > 0;
 
        return response()->json([
            'favorito'    => $added,
            'director_id' => $director->id,
        ], 200);
    }
}
