<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFavoritoObraTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('favorito_obra', function (Blueprint $table) {
            $table->unsignedBigInteger('id_usuario');
            $table->unsignedBigInteger('id_obra');
 
            $table->primary(['id_usuario', 'id_obra']);
 
            $table->foreign('id_usuario')
                ->references('id')->on('users')
                ->cascadeOnDelete();
 
            $table->foreign('id_obra')
                ->references('id')->on('obra')
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
        Schema::dropIfExists('favorito_obra');
    }
}
