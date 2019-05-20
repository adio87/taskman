<?php

use Illuminate\Database\Migrations\Migration;

class UpdateTasksChangeTitleChars extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        \DB::statement('ALTER TABLE `tasks` MODIFY `title` varchar(255)');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        \DB::statement('ALTER TABLE `tasks` MODIFY `title` varchar(50)');
    }
}
