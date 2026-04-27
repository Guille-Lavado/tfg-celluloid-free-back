<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePeliVideosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('peli_video', function (Blueprint $table) {
            $table->unsignedBigInteger('id_video')->primary();
            $table->foreignId('id_obra')->unique()->constrained('obra')->cascadeOnDelete();
 
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
        Schema::dropIfExists('peli_video');
    }
}
