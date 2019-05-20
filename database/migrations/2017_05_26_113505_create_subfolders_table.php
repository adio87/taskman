<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSubfoldersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('subfolders', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id')->unsigned()->nullable();
            $table->string('title', 50);
            $table->string('slug');
            $table->integer('order')->nullable();
            $table->timestamps();
        });

        Schema::table('subfolders', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->onUpdate('cascade')->onDelete('set null');
        });

        Schema::table('lists', function (Blueprint $table) {
            $table->integer('subfolder_id')->after('order')->unsigned()->nullable();
            $table->foreign('subfolder_id')->references('id')->on('subfolders')->onUpdate('cascade')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('lists', function (Blueprint $table) {
            $table->dropForeign('lists_subfolder_id_foreign');
            $table->dropColumn('subfolder_id');
        });

        Schema::dropIfExists('subfolders');
    }
}
