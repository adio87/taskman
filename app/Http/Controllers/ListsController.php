<?php

namespace App\Http\Controllers;

use App\PredefinedListsTag;
use Illuminate\Http\Request;
use App\Exceptions\HttpException;
use App\Helpers\Utils;

use App\Events\ListCreated;

use App\Lists;
use App\PredefinedTask;
use App\Task;
use App\Subfolder;
use App\ListsMember;

class ListsController extends Controller
{
    public $currentList;

    public function __construct()
    {
        $this->getUser();
    }

    /**
     * Display a listing of the resource.
     *
     * @return mixed
     */
    public function index()
    {
        try {
            if (!$this->user) {
                $e = Utils::$errors['not_logged_in'];
                return $this->error($e[0], $e[1]);
            }

            $this->createRecurringIfNotExist();

            $sublists = Subfolder::where('user_id', '=', $this->user->id)->with('lists')->get();

            $lists = Lists::query()
                ->where('user_id', $this->user->id)
                ->whereNull('subfolder_id')
                ->orderBy('order', 'asc')
                ->get();

            $shared = ListsMember::where([
                'user_id'   => $this->user->id,
                'status_id' => 3
            ])
                ->with('lists')
                ->get();

            return $this->success_item('Lists found', compact('lists', 'sublists', 'shared'));
        } catch (HttpException $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
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
            if (!$request->has(['title'])) {
                $e = Utils::throwError('value_not_found', 'Title');
                return $this->error($e->getMessage(), $e->getCode());
            }

            $data = $request->only('title');
            $data['user_id'] = $this->user->id;

            if ($request->has('folder_id') && $request->get('folder_id') != '') $data['subfolder_id'] = $request->get('folder_id');

            $list = Lists::create($data);

            if ($list) {
                $list->order = $list->id;
                $list->save();
            }

            if ($request->has('include') && $request->get('include')) {
                $this->currentList = $list;
                $this->addPredefined();
            }

            if ($request->has('tags')) {
                $tags = $request->get('tags');
                $this->addPredefinedTags($list, $tags);
            }

            event(new ListCreated($list, $this->user));
            return $this->success_item('New list created', $list);
        } catch (HttpException $e) {
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

            $lists = Lists::query()
                ->where([
                    'slug'    => $slug,
//                    'user_id' => $this->user->id
                ])
                ->with('tasks', 'done', 'members', 'owner');

            if ($lists->count())
                return $this->success_item('List found', $lists->first());
            else
                return $this->success_state('There is no lists');
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
     * @param  int  $id
     * @return mixed
     */
    public function update(Request $request, $id)
    {
        try {
            if (!$this->user) {
                $e = Utils::$errors['not_logged_in'];
                return $this->error($e[0], $e[1]);
            }

            $list = Lists::query()
                ->where('id', $id)
                ->first();

            if ($request->has('title')) {
                $data = $request->only('title');
                $list->update($data);
            }

            if ($request->has('include') && $request->get('include')) {
                $this->currentList = $list;
                $this->addPredefined();
            }

            if ($request->has('subfolder_id')) {
                $data = $request->only('subfolder_id');
                if ($data['subfolder_id'] == 'null') $data['subfolder_id'] = null;
                $list->update($data);
            }

            return $this->success_item('List updated!', $list);

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

            Lists::find($id)->delete();

            return $this->success_state('Deleted', 200);
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

            $lists = $request->get('list');

            if ($request->has('folders')) {
                $folders = $request->get('folders');
                foreach ($folders as $f) {
                    foreach ($f['lists'] as $k => $l) {
                        $item = Lists::find($l['id']);
                        if ($item) {
                            $item->order = $k;
                            $item->subfolder_id = $f['id'];
                            $item->save();
                        }
                    }
                }
            }

            foreach ($lists as $k => $l) {
                $item = Lists::find($l['id']);
                if ($item) {
                    $item->order = $k;
                    $item->subfolder_id = null;
                    $item->save();
                }
            }

            return $this->success_state('The list was updated');
        } catch (HttpException $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }

    public function createRecurringIfNotExist()
    {
        $query = Lists::where([
            'user_id'   => $this->user->id,
            'recurring' => 1
        ]);
        $predefined = PredefinedTask::where('user_id', '=', $this->user->id);

        if (!$query->count() && $predefined->count()) {
            $list = Lists::create([
                'title'     => 'Today',
                'user_id'   => $this->user->id,
                'recurring' => 1
            ]);
            $this->currentList = $list;
            $this->addPredefined();
        }
    }

    public function addPredefined()
    {
        $predefined = PredefinedTask::query()
            ->where('user_id', '=', $this->user->id)
            ->get();
        foreach ($predefined as $p) {
            $data = [
                'list_id' => $this->currentList->id,
                'predefined_id' => $p->id,
                'title' => $p->title
            ];
            Task::create($data);
        }
    }

    public function addPredefinedTags($list, $tags)
    {
        if (empty($tags)) {
            return false;
        }

        $tagsInsert = [];

        foreach ($tags as $t) {
            $tagsInsert[] = [
                'list_id' => $list->id,
                'tag_id' => $t['id']
            ];
        }

        PredefinedListsTag::query()
            ->insert($tagsInsert);

        return true;
    }

    public function destroyPredefined($id)
    {
        try {
            if (!$this->user) {
                $e = Utils::$errors['not_logged_in'];
                return $this->error($e[0], $e[1]);
            }

            $tasks = Task::query()
                ->where('list_id', '=', $id)
                ->whereNotNull('predefined_id')
                ->delete();


            return $this->success_state('Removed ' . $tasks . ' task(s).');
        } catch (HttpException $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }
}
