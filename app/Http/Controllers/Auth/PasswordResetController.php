<?php

namespace App\Http\Controllers\Auth;

use App\Exceptions\HttpException;
use App\Helpers\Utils;
use App\Mailers\AppMailer;
use App\User;
use App\PasswordReset;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;

class PasswordResetController extends Controller
{
    public function sendResetLinkEmail(Request $request, AppMailer $mailer)
    {
        $this->validate($request, [
            'email' => 'required|email|exists:users,email',
        ]);

        //invalidate old tokens
        PasswordReset::whereEmail($request->email)->delete();

        $email = $request->email;
        $reset = PasswordReset::query()->create([
            'email' => $email,
            'token' => str_random(10),
        ]);

        $token = $reset->token;

        $mailer->sendResetLinkEmail(compact('email', 'token'), 'Password Reset Link', 'emails.reset_password');

        return $this->success_state(__('auth.reset.sent'));
    }

    public function verify(Request $request)
    {
        $this->validate($request, [
            'email' => 'required|email',
            'token' => 'required',
        ]);

        $check = PasswordReset::whereEmail($request->email)
        ->whereToken($request->token)
        ->first();

        if (!$check) {
            return $this->error(__('auth.failed.email'), 422);
        }

        return $this->success_state(__('auth.reset.new'));
    }

    public function reset(Request $request)
    {
        $this->validate($request, [
            'email'    => 'required|email',
            'token'    => "required|exists:password_resets,token,email,{$request->email}",
            'password' => 'required|min:8|confirmed',
        ]);

        $user = User::whereEmail($request->email)->firstOrFail();
        $user->password = bcrypt($request->password);
        $user->save();

        //delete pending resets
        PasswordReset::whereEmail($request->email)->delete();

        return $this->success_state(__('auth.reset.success'));
    }

    public function resetFromDashboard(Request $request)
    {
        $this->validate($request, [
            'old'    => 'required|min:8',
            'password'    => 'required|min:8|confirmed',
        ]);

        $this->getUser();

        try {
            if (!$this->user) {
                $e = Utils::$errors['not_logged_in'];
                return $this->error($e[0], $e[1]);
            }

            if (Hash::check($request->get('old'), $this->user->password)) {
                $this->user->update(['password'=> Hash::make($request->get('password'))]);
            }

            return $this->success_state('Successfully updated');

        } catch (HttpException $e) {

            return $this->error($e->getMessage(), $e->getCode());

        }
    }
}
