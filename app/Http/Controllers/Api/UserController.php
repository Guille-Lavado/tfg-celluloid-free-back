<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

use App\User;

class UserController extends Controller
{
    // Muestra todos los Usuarios
    public function index()
    {
        $usuarios = User::select('id', 'name', 'email', 'rol', 'created_at')->get();
 
        return response()->json($usuarios, 200);
    }
 
    // Muestra información de un Usuario
    public function show(int $id)
    {
        $usuario = User::findOrFail($id);
 
        return response()->json($usuario->makeHidden(['password', 'remember_token']), 200);
    }
 
    // Crear un nuevo Usuario
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'     => 'required|string|max:100',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'rol'      => ['required', Rule::in(['administrador', 'usuario'])],
        ]);
 
        $usuario = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
            'rol'      => $data['rol'],
        ]);
 
        return response()->json($usuario->makeHidden(['password', 'remember_token']), 201);
    }
 
    // Actualizar Usuario
    public function update(Request $request, int $id)
    {
        $usuario = User::findOrFail($id);
 
        $data = $request->validate([
            'name'     => 'sometimes|string|max:100',
            'email'    => ['sometimes', 'email', Rule::unique('users', 'email')->ignore($usuario->id)],
            'password' => 'sometimes|string|min:8|confirmed',
            'rol'      => ['sometimes', Rule::in(['administrador', 'usuario'])],
        ]);
 
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }
 
        $usuario->update($data);
 
        return response()->json($usuario->makeHidden(['password', 'remember_token']), 200);
    }
 
    // Eliminar Usuario
    public function destroy(Request $request, int $id)
    {
        $usuario = User::findOrFail($id);
 
        if ($usuario->id === $request->user()->id) {
            return response()->json(['message' => 'No puedes eliminar tu propia cuenta.'], 403);
        }
 
        $usuario->delete();
 
        return response()->json(['message' => 'Usuario eliminado correctamente.']);
    }
}
