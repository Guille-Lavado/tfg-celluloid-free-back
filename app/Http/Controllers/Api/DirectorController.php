<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Director;

class DirectorController extends Controller
{
    /**
     * Obtener todos los Directores
     */
    public function index()
    {
        $directores = Director::query()->orderBy('created_at', 'desc')->get();
    
        $res_director = [];
        foreach($directores as $director) {
            $res_director[] = [
                'id' => $director['id'],
                'nombre' => $director['nombre'],
                'fecha de nacimiento' => $director['fecha_nacimiento'],
                'biografia' => $director['biografia'],
                'imagen' => $director['img'],
            ];
        }

        return response()->json($res_director, 200);
    }

    /**
     * Crear y validar un nuevo Director
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'nombre'              => 'required|string|max:100',
            'fecha_de_nacimiento' => 'nullable|date',
            'biografia'           => 'nullable|string',
        ]);
 
        $director = Director::create($data);
 
        return response()->json([
            'message' => 'Director creado correctamente',
            'data' => $director
        ], 201);
    }

    /**
     * Obtener Director por Id
     */
    public function show($id)
    {
        $director = Director::findOrFail($id);
 
        return response()->json($director, 200);
    }

    /**
     * Actualizar y validar un Director
     */
    public function update(Request $request, $id)
    {
        $director = Director::findOrFail($id);
 
        $data = $request->validate([
            'nombre'              => 'sometimes|string|max:100',
            'fecha_de_nacimiento' => 'sometimes|nullable|date',
            'biografia'           => 'sometimes|nullable|string',
        ]);
 
        $director->update($data);
 
        return response()->json([
            'message' => 'Director actualizado correctamente',
            'data' => $director
        ], 200);
    }

    /**
     * Eliminar un Director
     */
    public function destroy($id)
    {
        $director = Director::findOrFail($id);
 
        try {
            $director->delete();
        } catch (\Illuminate\Database\QueryException $e) {
            return response()->json([
                'message' => 'No se puede eliminar el director porque tiene obras asociadas'
            ], 500);
        }
 
        return response()->json(['message' => 'Director eliminado correctamente'], 200);
    }
}
