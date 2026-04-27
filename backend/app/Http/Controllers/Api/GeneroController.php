<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Genero;

class GeneroController extends Controller
{
    /**
     * Obtener todos los Géneros
     */
    public function index()
    {
        $generos = Genero::query()->orderBy('created_at', 'desc')->get();
    
        $res_genero = [];
        foreach($generos as $genero) {
            $res_genero[] = [
                'id' => $genero['id'],
                'nombre' => $genero['nombre'],
            ];
        }

        return response()->json($res_genero, 200);
    }

    /**
     * Crear nuevo Género.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'nombre' => 'required|string|max:50|unique:genero,nombre',
        ]);
 
        $genero = Genero::create($data);
 
        return response()->json($genero, 201);
    }

    /**
     * Actualizar Género
     */
    public function update(Request $request, $id)
    {
        $genero = Genero::findOrFail($id);
 
        $data = $request->validate([
            'nombre' => 'required|string|max:50|unique:genero,nombre,' . $id,
        ]);
 
        $genero->update($data);
 
        return response()->json($genero, 200);
    }

    /**
     * Eliminar Género
     */
    public function destroy($id)
    {
        $genero = Genero::findOrFail($id);
 
        try {
            $genero->delete();
        } catch (\Illuminate\Database\QueryException $e) {
            return response()->json([
                'message' => 'No se puede eliminar el género porque tiene obras asociadas.'
            ], 409);
        }
 
        return response()->json(['message' => 'Género eliminado correctamente']);
    }
}
