<?php

namespace App\Http\Controllers;

use App\ListsTag;
use Illuminate\Http\Request;
use App\Tag;

use App\Exceptions\HttpException;
use App\Helpers\Utils;

class TagsController extends Controller
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
        try {
            if (!$this->user) {
                $e = Utils::$errors['not_logged_in'];
                return $this->error($e[0], $e[1]);
            }

            $tags = Tag::all();

            return $this->success_item('Lists found', $tags);
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
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try {
            if (!$this->user) {
                $e = Utils::$errors['not_logged_in'];
                return $this->error($e[0], $e[1]);
            }
            if (!$request->has(['title', 'color'])) {
                $e = Utils::throwError('value_not_found', 'Title, Color');
                return $this->error($e->getMessage(), $e->getCode());
            }

            $data = $request->only(['title', 'color']);

            $tag = Tag::query()->create($data);


            return $this->success_item('Tag was created!', $tag);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {
            if (!$this->user) {
                $e = Utils::$errors['not_logged_in'];
                return $this->error($e[0], $e[1]);
            }

            $tags = ListsTag::query()
                ->where('task_id', $id)
                ->with('tag')
                ->get();

            if ($tags)
                return $this->success_item('Task found', $tags);
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
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
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

            $tag = Tag::query()->find($id);

            if ($tag) {
                $tag->delete();
                return $this->success_state('Tag was deleted!', 200);
            }
            return $this->error('Error', 400);
        } catch (HttpException $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }

    public function taskAdd(Request $request)
    {
        try {
            if (!$this->user) {
                $e = Utils::$errors['not_logged_in'];
                return $this->error($e[0], $e[1]);
            }
            if (!$request->has(['task_id', 'tag_id'])) {
                $e = Utils::throwError('value_not_found', 'Title, Color');
                return $this->error($e->getMessage(), $e->getCode());
            }

            $data = $request->only(['task_id', 'tag_id']);

            $tag = ListsTag::query()->create($data);

            return $this->success_item('Tag was created!', $tag);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }

    public function taskDestroy($id)
    {
        try {
            if (!$this->user) {
                $e = Utils::$errors['not_logged_in'];
                return $this->error($e[0], $e[1]);
            }

            $tag = ListsTag::query()->find($id);

            if ($tag) {
                $tag->delete();
                return $this->success_state('Tag was deleted!', 200);
            }
            return $this->error('Error', 400);
        } catch (HttpException $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }
}
