<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Queue\SerializesModels;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

use App\User;

class TaskCreated implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public $task;
    public $list;
    public $user;

    /**
     * Create a new event instance.
     * @param $task
     * @param User $user
     *
     * @return mixed
     */
    public function __construct($task, User $user)
    {
        $this->task  = $task;
        $this->list  = $task->parentList;
        $this->user  = $user;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return Channel|array
     */
    public function broadcastOn()
    {
        return [
            new PrivateChannel('taskman-chanel.' . $this->user->id),
            new PrivateChannel('taskman-chanel.' . $this->user->id . '.' . $this->list->id)
        ];
    }

    /**
     * The event's broadcast name.
     *
     * @return string
     */
    public function broadcastAs()
    {
        return 'task.created';
    }
}
