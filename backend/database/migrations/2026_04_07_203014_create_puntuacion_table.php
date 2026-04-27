<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePuntuacionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('puntuacion', function (Blueprint $table) {
            $table->unsignedBigInteger('id_video');
            $table->unsignedBigInteger('id_user');
            $table->unsignedTinyInteger('valor')->default(1); // 1 - 5
 
            $table->primary(['id_video', 'id_user']);
 
            $table->foreign('id_video')
                ->references('id')->on('videometraje')
                ->cascadeOnDelete();
 
            $table->foreign('id_user')
                ->references('id')->on('users')
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
        Schema::dropIfExists('puntuacion');
    }
}
