<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTasksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('list_id')->unsigned()->nullable();
            $table->integer('predefined_id')->unsigned()->nullable();
            $table->string('title', 50);
            $table->string('slug');
            $table->tinyInteger('checked')->default(0);
            $table->integer('order')->nullable();
            $table->dateTime('due_date')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::table('tasks', function (Blueprint $table) {
            $table->foreign('list_id')->references('id')->on('lists')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('predefined_id')->references('id')->on('predefined_tasks')->onUpdate('cascade')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tasks');
    }
}
