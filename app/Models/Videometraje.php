<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\User;

class Videometraje extends Model
{
    protected $table = 'videometraje';

    protected $fillable = [
        'url_video',
        'duracion',
        'nombre',
    ];

    // Devuelve la duración formateada como H:MM:SS o MM:SS
    public function getDuracionFormateada(): string
    {
        $h = intdiv($this->duracion, 3600);
        $m = intdiv($this->duracion % 3600, 60);
        $s = $this->duracion % 60;

        return $h > 0
            ? sprintf('%d:%02d:%02d', $h, $m, $s)
            : sprintf('%02d:%02d', $m, $s);
    }

    public function pelicula()
    {
        return $this->hasOne(PeliVideo::class, 'id_video');
    }

    public function capitulo()
    {
        return $this->hasOne(SerieVideo::class, 'id_video');
    }

    public function comentarios()
    {
        return $this->hasMany(Comentario::class, 'id_video');
    }

    public function likes()
    {
        return $this->belongsToMany(User::class, 'likes', 'id_video', 'id_user');
    }
}