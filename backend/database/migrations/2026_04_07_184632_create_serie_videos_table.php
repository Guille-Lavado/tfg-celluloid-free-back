<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSerieVideosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('serie_video', function (Blueprint $table) {
            $table->unsignedBigInteger('id_video')->primary();
            $table->foreignId('id_obra')->constrained('obra')->cascadeOnDelete();
            $table->unsignedInteger('temporada');
            $table->unsignedInteger('episodio');
 
            $table->foreign('id_video')
                ->references('id')->on('videometraje')
                ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('serie_video');
    }
}
