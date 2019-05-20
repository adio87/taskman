<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Helpers\Utils;

class PusherController extends Controller
{
    public $pusher;

    //accessed through '/pusher/'
    public function __construct() {
        //Let's register our pusher application with the server.
        //I have used my own config files. The config keys are self-explanatory.
        //You have received these config values from pusher itself, when you signed up for their service.
        $this->pusher = new \Pusher(\Config::get('broadcasting.connections.pusher.key'), \Config::get('broadcasting.connections.pusher.secret'), \Config::get('broadcasting.connections.pusher.app_id'));
        $this->getUser();
    }

    /**
     * Authenticates logged-in user in the Pusher JS app
     * For presence channels
     * @param Request $request
     */
    public function auth(Request $request)
    {
        //We see if the user is logged in our laravel application.
        if($this->user) {
            if (!$request->has(['channel_name', 'socket_id'])) {
                $e = Utils::throwError('value_not_found', 'Chanel name, Soket ID');
                return $this->error($e->getMessage(), $e->getCode());
            }

            //Fetch User Object
            $user =  $this->user;
            //Presence Channel information. Usually contains personal user information.
            //See: https://pusher.com/docs/client_api_guide/client_presence_channels
            $presence_data = ['name' => $user->name];
            //Registers users' presence channel.
            echo $this->pusher->presence_auth($request->get('channel_name'), $request->get('socket_id'), $user->id, $presence_data);
        } else {
            return $this->error('Forbidden',403);
        }
    }
}
