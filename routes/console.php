<?php

use Illuminate\Foundation\Inspiring;
use App\Task;
use Carbon\Carbon;

/*
|--------------------------------------------------------------------------
| Console Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of your Closure based console
| commands. Each Closure is bound to a command instance allowing a
| simple approach to interacting with each command's IO methods.
|
*/

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->describe('Display an inspiring quote');


Artisan::command('recurring_tasks:refresh', function () {

    $start = (new Carbon('now'))->hour(0)->minute(0)->second(0);
    $end = (new Carbon('now'))->hour(23)->minute(59)->second(59);

    $tasks = Task::join('lists', 'lists.id', '=', 'tasks.list_id')
        ->select(DB::raw('tasks.*, lists.recurring'))
        ->where('checked', 1)
        ->where(function($q) {
            $q->whereNotNull('predefined_id');
//                ->orWhere('recurring', 1);
        })
        ->whereNotBetween('tasks.created_at', [$start , $end]);

    if ($tasks->count()) {
        foreach ($tasks->get() as $task) {
            $task->update([
                'checked' => 0,
            ]);
        }
    }

    $this->comment($tasks->get());

})->describe('Refresh predefined recurring tasks if checked.');