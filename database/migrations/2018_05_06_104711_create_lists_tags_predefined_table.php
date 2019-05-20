<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateListsTagsPredefinedTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('predefined_lists_tags', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('list_id')->unsigned()->nullable();
            $table->integer('tag_id')->unsigned()->nullable();
        });

        Schema::table('predefined_lists_tags', function (Blueprint $table) {
            $table->foreign('list_id')->references('id')->on('lists')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('tag_id')->references('id')->on('tags')->onUpdate('cascade')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('predefined_lists_tags');
    }
}
