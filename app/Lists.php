<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\Sluggable;

class Lists extends Model
{
    use Sluggable;

    public $table = 'lists';

    protected $fillable = [
        'title', 'user_id', 'subfolder_id', 'recurring'
    ];

    public $with = ['inCompleted', 'predefined'];

    public function tasks()
    {
        return $this->hasMany('App\Task', 'list_id', 'id')->where('checked', '=', '0')->orderBy('order', 'asc');
    }

    public function done()
    {
        return $this->hasMany('App\Task', 'list_id', 'id')->where('checked', '=', '1')->orderBy('updated_at', 'desc');
    }

    public function members()
    {
        return $this->hasMany('App\ListsMember', 'list_id', 'id');
    }

    public function owner()
    {
        return $this->hasOne('App\User', 'id', 'user_id');
    }

    public function inCompleted()
    {
        return $this->hasMany('App\Task', 'list_id', 'id')
            ->where('checked', '=', 0)
            ->selectRaw('list_id, count(*) as count')
            ->groupBy('list_id');
    }

    public function predefined()
    {
        return $this->hasMany('App\Task', 'list_id', 'id')
            ->whereNotNull('predefined_id')
            ->selectRaw('list_id, count(*) as count')
            ->groupBy('list_id');
    }

    public function predefinedTags()
    {
        return $this->hasMany('App\PredefinedListsTag', 'list_id', 'id');
    }

    /**
     * Return the sluggable configuration array for this model.
     *
     * @return array
     */
    public function sluggable()
    {
        return [
            'slug' => [
                'source' => 'title'
            ]
        ];
    }
}
