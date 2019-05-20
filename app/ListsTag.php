<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ListsTag extends Model
{
    public $timestamps = false;

    protected $fillable = ['task_id', 'tag_id'];

    public function tag()
    {
        return $this->hasOne('App\Tag', 'id', 'tag_id');
    }
}
