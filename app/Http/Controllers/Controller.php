<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;

use Illuminate\Validation\ValidationException;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Facades\JWTAuth;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public $user;

    /*fixes unwanted redirects when validation fails*/
//    public function validate(Request $request, array $rules, array $messages = [], array $customAttributes = [])
//    {
//        $validator = $this->getValidationFactory()->make($request->all(), $rules, $messages, $customAttributes);
//
//        if ($validator->fails()) {
//            if (\Route::current()->getPrefix() === 'api') {
//                $message = $validator->errors()->first();
//                throw new ValidationException($message);
//            } else {
//                throw new ValidationException($this);
//            }
//        }
//    }

    public function success_item($message, $item = [], $setting = [])
    {
        return response()->json([
            "message" => $message,
            "status" => "ok",
            "item" => $item,
            "setting" => $setting
        ])
            ->header('Content-Type', 'application/json');
    }

    public function success_state($message, $code = 200)
    {
        return response([
            "message" => $message,
            "status" => "ok",
        ], $code)
            ->header('Content-Type', 'text/plain');
    }

    public function error($message, $code)
    {
        if ($code == 0 || !$code)
            $code = 400;

        return response([
            "message" => $message,
            "status" => "error"
        ], $code)
            ->header('Content-Type', 'text/plain');
    }

    public function getUser()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
        } catch (TokenExpiredException $e) {
            return false;
        } catch (TokenInvalidException $e) {
            return false;
        } catch (JWTException $e) {
            return false;
        }
        $this->user = $user;
        return $user;
    }
}
