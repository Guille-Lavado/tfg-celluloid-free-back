<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PeliVideo extends Model
{
    protected $table = 'peli_video';

    // La PK no es autoincremental, es id_video
    protected $primaryKey = 'id_video';
    public $incrementing  = false;
    public $timestamps    = false;

    protected $fillable = [
        'id_video',
        'id_obra',
    ];

    public function videometraje()
    {
        return $this->belongsTo(Videometraje::class, 'id_video');
    }

    public function obra()
    {
        return $this->belongsTo(Obra::class, 'id_obra');
    }
}