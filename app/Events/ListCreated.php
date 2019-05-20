<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Queue\SerializesModels;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

use App\User;

class ListCreated implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public $list;
    public $user;
    /**
     * Create a new event instance.
     * @param $list
     * @param User $user
     *
     * @return void|mixed
     */
    public function __construct($list, User $user)
    {
        $this->list = $list;
        $this->user = $user;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('taskman-chanel.' . $this->user->id);
    }

    /**
     * The event's broadcast name.
     *
     * @return string
     */
    public function broadcastAs()
    {
        return 'list.created';
    }
}
