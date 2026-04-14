<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

use App\Models\Videometraje;
use App\Models\Comentario;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'rol',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    // convertie automáticamente los valores de la base de datos
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
        ];
    }

    public function likes()
    {
        return $this->belongsToMany(Videometraje::class, 'likes', 'id_user', 'id_video');
    }

    public function comentarios()
    {
        return $this->hasMany(Comentario::class, 'id_user');    
    }
}