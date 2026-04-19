<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

use App\User;

use App\Models\Genero;
use App\Models\Director;
use App\Models\Obra;
use App\Models\Videometraje;
use App\Models\PeliVideo;
use App\Models\Comentario;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $usuario = User::create([
            'name'     => 'Guille',
            'email'    => 'guille@example.com',
            'password' => Hash::make('password'),
            'rol'      => 'usuario',
        ]);

        $cienciaFi = Genero::create(['nombre' => 'Ciencia Ficción']);

        $kubrick = Director::create([
            'nombre'              => 'Stanley Kubrick',
            'fecha_nacimiento' => '1928-07-26',
            'biografia'           => 'Director y productor estadounidense, considerado uno de los más influyentes de la historia del cine.',
            'img'                 => 'https://storage.celluloid.com/directores/kubrick-perfil.jpg'
        ]);

        $odisea = Obra::create([
            'titulo'      => '2001: A Space Odyssey',
            'sinopsis'    => 'Tras el descubrimiento de un misterioso monolito enterrado bajo la superficie lunar, un viaje a Júpiter degenera cuando la IA del barco empieza a mostrar comportamiento hostil.',
            'poster'      => 'https://storage.celluloid.com/obras/a-space-odyssey.png',
            'id_genero'   => $cienciaFi->id,
            'id_director' => $kubrick->id,
        ]);

        $videoOdisea = Videometraje::create([
            'url_video' => 'https://storage.celluloid.com/videos/2001-space-odyssey.mp4',
            'duracion'  => 8940, // 2h 29min
            'nombre'    => '2001: A Space Odyssey (1968)',
        ]);

        PeliVideo::create([
            'id_video' => $videoOdisea->id,
            'id_obra'  => $odisea->id,
        ]);

        Comentario::create([
            'id_video'  => $videoOdisea->id,
            'id_user'   => $usuario->id,
            'contenido' => 'Una película que se adelantó décadas a su tiempo.',
        ]);

        $usuario->puntuaciones()->attach($videoOdisea->id, ['valor' => 5]);
    }
}
