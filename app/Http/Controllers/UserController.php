<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use App\Exceptions\HttpException;
use App\Helpers\Utils;

use App\ListsMember;

use App\Mailers\AppMailer;

class UserController extends Controller
{

    public function __construct()
    {
        $this->getUser();
    }

    public function user()
    {
        if ($this->user) {
            $user = User::where('id', '=', $this->user->id)
                ->with('lists', 'shared')
                ->first();
            return response()->success([
                "message" => "User found",
                "status" => "ok",
                "user" => $user,
            ])
                ->header('Content-Type', 'application/json');
        } else
            return response()->success([
                "message" => "User not found",
                "status" => false,
            ])
                ->header('Content-Type', 'application/json');
    }

    public function invite(Request $request, AppMailer $mailer)
    {
        try {
            if (!$this->user) {
                $e = Utils::$errors['not_logged_in'];
                return $this->error($e[0], $e[1]);
            }
            if (!$request->has(['list_id', 'user_id'])) {
                $e = Utils::throwError('value_not_found', 'List, User');
                return $this->error($e->getMessage(), $e->getCode());
            }

            $data = $request->only(['list_id', 'user_id']);

            $member = ListsMember::where($data);

            if ($member->count()) {
                return $this->error('Already exist', 400);
            }

            $data['status_id'] = 2;
            $data['token'] = bin2hex(random_bytes(50));

            $member = ListsMember::create($data);

            $user = User::find($data['user_id']);

            $mailer->send($user, 'You are invited!', 'emails.invite', ['token' => $data['token'], 'member' => $member]);

            return $this->success_item('The member was added', $member->find($member->id));
        } catch (HttpException $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }

    public function deleteMember($id)
    {
        try {
            if (!$this->user) {
                $e = Utils::$errors['not_logged_in'];
                return $this->error($e[0], $e[1]);
            }

            ListsMember::find($id)->delete();

            return $this->success_state('Deleted', 200);
        } catch (HttpException $e) {
            return $this->error($e->getMessage(), $e->getCode());
        }
    }

    public function checkToken($id, $token)
    {
        $member = ListsMember::find($id);

        if ($member->token != null && $member->token == $token) {
            $member->token = null;
            $member->status_id = 3;
            $member->save();
        }

        return redirect('/');
    }
}
