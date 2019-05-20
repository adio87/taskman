<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateListsMembersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('lists_members', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id')->unsigned()->nullable();
            $table->integer('list_id')->unsigned()->nullable();
            $table->integer('status_id')->unsigned()->nullable();
            $table->string('token', 100)->nullable();
        });

        Schema::table('lists_members', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('list_id')->references('id')->on('lists')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('status_id')->references('id')->on('lists_members_statuses')->onUpdate('cascade')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('lists_members');
    }
}
