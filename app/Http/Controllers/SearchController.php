<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Exceptions\HttpException;
use App\Helpers\Utils;

use App\Task;
use App\User;

class SearchController extends Controller
{
    public function __construct()
    {
        $this->getUser();
    }

    public function index($query, Request $request)
    {
        try {
            if (!$this->user) {
                $e = Utils::$errors['not_logged_in'];
                return $this->error($e[0], $e[1]);
            }

            $by = ($request->has('by') && $request->get('by') !== 'by') ? $request->get('by') : null;

            $search1 = Task::query()
                ->join('lists', 'lists.id', '=', 'tasks.list_id')
                ->join('users', 'users.id', '=', 'lists.user_id')
                ->selectRaw('tasks.*, lists.slug as list_slug, lists.title as list_title')
                ->where('users.id', $this->user->id);

            if ($by == 'tag') {
                $search1
                    ->join('lists_tags', 'lists_tags.task_id', '=', 'tasks.id')
                    ->join('tags', 'tags.id', '=', 'lists_tags.tag_id')
                    ->where('tags.title', 'like', '%' . $query . '%');
            } else {
                $search1
                    ->where('tasks.title', 'like', '%' . $query . '%');
            }

            $search2 = clone $search1;

            $done = $search1->where('tasks.checked', 1)->get();
            $notDone = $search2->where('tasks.checked', 0)->get();
            $total = $done->count() + $notDone->count();

            return $this->success_item('Search results', compact('done', 'notDone', 'total'));
        } catch (HttpException $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }

    public function users(Request $request)
    {
        try {
//            if (!$this->user) {
//                $e = Utils::$errors['not_logged_in'];
//                return $this->error($e[0], $e[1]);
//            }
            if (!$request->has(['q'])) {
                $e = Utils::throwError('value_not_found', 'Query');
                return $this->error($e->getMessage(), $e->getCode());
            }
            $query = $request->get('q');

            $search = User::query()
                ->where('name', 'like', '%' . $query . '%')
                ->orWhere('email', 'like', '%' . $query . '%')
                ->get();

            return $this->success_item('Search results', $search);
        } catch (HttpException $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }
}
