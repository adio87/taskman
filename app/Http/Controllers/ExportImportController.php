<?php

namespace App\Http\Controllers;

use App\Task;
use Illuminate\Http\Request;
use App\Exceptions\HttpException;
use App\Helpers\Utils;
use Illuminate\Support\Facades\Input;

use App\Lists;

use File;

class ExportImportController extends Controller
{
    public function __construct()
    {
        $this->getUser();
    }

    public function export($id)
    {
        try {
            if (!$this->user) {
                $e = Utils::$errors['not_logged_in'];
                return $this->error($e[0], $e[1]);
            }

            if ($id == 'all') {
                $lists = Lists::where(['user_id' => $this->user->id])
                    ->with('tasks', 'done')
                    ->get();
            } else {
                $lists = Lists::where(['id' => $id])
                    ->with('tasks', 'done')
                    ->get();
            }

            return $this->success_item('Export to json success.', $lists);
        } catch (HttpException $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }

    public function import(Request $request)
    {
        if (!$this->user) {
            $e = Utils::$errors['not_logged_in'];
            return $this->error($e[0], $e[1]);
        }

        $file = array('file' => Input::file('file'));
        // setting up rules
        $rules = array('file' => 'required',); //mimes:jpeg,bmp,png and for max size max:10000
        // doing the validation, passing post data, rules and the messages
        $v = \Validator::make($file, $rules);
        if ($v->fails()) {
            // send back to the page with the input data and errors
            return $this->error($v->errors(), 422);
        } else {
            // checking file is valid.
            try {
                if (Input::file('file')->isValid()) {

                    $f = Input::file('file')->openFile();
                    $json = json_decode($f->fread($f->getSize()));

                    foreach ($json as $j) {

                        $data = array_only((array)$j, ['title', 'subfolder_id', 'recurring']);
                        $data['user_id'] = $this->user->id;

                        $list = Lists::create($data);

                        foreach ($j->tasks as $task) {
                            $_data = array_only((array)$task, ['title', 'checked', 'due_date', 'description',
                                'high_priority', 'estimated_time', 'order']);
                            $_data['list_id'] = $list->id;
                            Task::create($_data);
                        }

                        foreach ($j->done as $task) {
                            $_data = array_only((array)$task, ['title', 'checked', 'due_date', 'description',
                                'high_priority', 'estimated_time', 'order']);
                            $_data['list_id'] = $list->id;
                            Task::create($_data);
                        }


                    }

                    // sending back with message
                    return $this->success_state('Decoded!');
                } else {
                    return $this->error('Invalid file', 400);
                }
            } catch(\Exception $e) {
                // sending back with error message.
                if (isset($destinationPath) && $destinationPath != '' && isset($fileName) && $fileName != '' )
                    File::Delete($destinationPath . '/' . $fileName);
                return $this->error($e->getMessage(), $e->getCode());
            }

        }
    }
}
