<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Exceptions\HttpException;
use App\Helpers\Utils;

use App\PredefinedTask;

class PredefinedController extends Controller
{
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

            $lists = PredefinedTask::query()
                ->where('user_id', $this->user->id);

            if ($lists->count())
                return $this->success_item('Predefined found', $lists->get());
            else
                return $this->success_state('There is no predefined');
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
            $task = PredefinedTask::create($data);

            return $this->success_item('New predefined created', $task);
        } catch (HttpException $e) {
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
        //
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
     * @return mixed
     */
    public function destroy($id)
    {
        try {
            if (!$this->user) {
                $e = Utils::$errors['not_logged_in'];
                return $this->error($e[0], $e[1]);
            }

            PredefinedTask::find($id)->delete();

            return $this->success_state('Deleted', 200);
        } catch (HttpException $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }
}
