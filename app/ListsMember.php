<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ListsMember extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'list_id', 'user_id', 'status_id', 'token'
    ];

    public $with = ['user', 'status'];

    public function user()
    {
        return $this->hasOne('App\User', 'id', 'user_id');
    }

    public function status()
    {
        return $this->hasOne('App\ListsMembersStatus', 'id', 'status_id');
    }

    public function lists()
    {
        return $this->hasOne('App\Lists', 'id', 'list_id');
    }
}
