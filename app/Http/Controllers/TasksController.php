<?php

namespace App\Http\Controllers;

use App\Events\TaskCreated;
use App\Events\TaskDeleted;
use App\Events\TaskChecked;

use App\Lists;
use App\ListsTag;
use Illuminate\Http\Request;
use App\Exceptions\HttpException;
use App\Helpers\Utils;

use App\Task;

class TasksController extends Controller
{
    public function __construct()
    {
        $this->getUser();
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return mixed
     */
    public function store(Request $request)
    {
        try {
            if (!$this->user) {
                $e = Utils::$errors['not_logged_in'];
                return $this->error($e[0], $e[1]);
            }
            if (!$request->has(['title', 'list_id'])) {
                $e = Utils::throwError('value_not_found', 'Title, List ID');
                return $this->error($e->getMessage(), $e->getCode());
            }

            $list = Lists::query()
                ->find($request->get('list_id'));

            $data = $request->only(['title', 'list_id']);

            $task = Task::create($data);

            if ($request->has('first') && $request->get('first')) {
                $task = $this->orderFirst($data['list_id']);
            } else {
                $task->order = $task->id;
                $task->save();
            }

            if (count($list->predefinedTags()->get())) {
                $predefinedTags = $list->predefinedTags()->get();
                $tagsToInsert = [];

                foreach ($predefinedTags as $p) {
                    $tagsToInsert[] = [
                        'task_id' => $task->id,
                        'tag_id' => $p['tag_id']
                    ];
                }

                ListsTag::query()
                    ->insert($tagsToInsert);

            }

            event(new TaskCreated($task, $this->user));

            return $this->success_item('Task created', $task);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  string  $slug
     * @return mixed
     */
    public function show($slug)
    {
        try {
            if (!$this->user) {
                $e = Utils::$errors['not_logged_in'];
                return $this->error($e[0], $e[1]);
            }

            $task = Task::query()
                ->where('slug', $slug)
                ->first();

            if ($task)
                return $this->success_item('Task found', $task);
            else
                return $this->error('There is no task', 400);
        } catch (HttpException $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $slug
     * @return mixed
     */
    public function update($slug, Request $request)
    {
        try {
            if (!$this->user) {
                $e = Utils::$errors['not_logged_in'];
                return $this->error($e[0], $e[1]);
            }

            $data = $request->all();
            if (isset($data['high_priority'])) $data['high_priority'] = ($data['high_priority'] === 'true' || $data['high_priority'] === true) ? 1 : 0;

            $task = Task::query()
                ->where('slug', $slug)
                ->first();
            $task->update($data);
            return $this->success_item('Task updated!', $task);

        } catch (HttpException $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            if (!$this->user) {
                $e = Utils::$errors['not_logged_in'];
                return $this->error($e[0], $e[1]);
            }

            $task = Task::find($id);

            $obj = new \stdClass();
            $obj->id = $id;
            $obj->parentList = $task->parentList;

            if ($task) {
                $task->delete();
                event(new TaskDeleted($obj, $this->user));
                return $this->success_state('Deleted', 200);
            }
            return $this->error('Error', 400);
        } catch (HttpException $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }

    public function order(Request $request)
    {
        try {
            if (!$this->user) {
                $e = Utils::$errors['not_logged_in'];
                return $this->error($e[0], $e[1]);
            }
            if (!$request->has(['list'])) {
                $e = Utils::throwError('value_not_found', 'List');
                return $this->error($e->getMessage(), $e->getCode());
            }

            $tasks = $request->get('list');

            foreach ($tasks as $k => $t) {
                $item = Task::find($t['id']);
                if ($item) {
                    $item->order = $k;
                    $item->save();
                }
            }

            return $this->success_state('The list was updated');
        } catch (HttpException $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }

    public function check($slug)
    {
        try {
            if (!$this->user) {
                $e = Utils::$errors['not_logged_in'];
                return $this->error($e[0], $e[1]);
            }

            $task = Task::query()
                ->where('slug', $slug)
                ->first();

            if ($task) {
                $task->checked = $task->checked == 1 ? 0 : 1;
                $task->save();
            }

            $list = Lists::find($task->list_id);

            $obj = new \stdClass();
            $obj->id = $task->id;
            $obj->parentList = $list;

            event(new TaskChecked($obj, $this->user));

            return $this->success_item('The task was updated', $task);
        } catch (HttpException $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }

    public function orderFirst($list_id)
    {
        $tasks = Task::where(['list_id' => $list_id])->orderBy('order')->get();

        foreach ($tasks as $key => $t) {
            $t->order = $key;
            $t->save();
        }
        return $tasks[0];
    }
}
