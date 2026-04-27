<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Obra extends Model
{
    protected $table = 'obra';

    protected $fillable = [
        'titulo',
        'sinopsis',
        'poster',
        'id_genero',
        'id_director',
    ];

    public function genero()
    {
        return $this->belongsTo(Genero::class, 'id_genero');
    }

    public function director()
    {
        return $this->belongsTo(Director::class, 'id_director');
    }

    // Relación con la tabla pivote peli_video (1:1)
    public function peliVideo()
    {
        return $this->hasOne(PeliVideo::class, 'id_obra');
    }

    // Relación con los capítulos de la serie (a través de serie_video)
    public function capitulosVideo()
    {
        return $this->hasMany(SerieVideo::class, 'id_obra');
    }
}