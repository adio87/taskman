<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\Sluggable;

class Task extends Model
{
    use Sluggable;

    public $with = ['tag'];

    protected $fillable = [
        'title', 'list_id', 'predefined_id', 'order', 'checked', 'description', 'due_date', 'high_priority',
        'estimated_time'
    ];

    public function tag()
    {
        return $this->hasMany('App\ListsTag', 'task_id', 'id')->with('tag');
    }

    public function parentList()
    {
        return $this->belongsTo('App\Lists', 'list_id', 'id')->with('owner');
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

    public static function create(array $attributes = [])
    {
        $query = static::query();
        $model = $query->create($attributes);

        $return = $query->where('id', '=', $model->id)->with('parentList')->first();
        return $return;
    }

    public static function find($id)
    {
        $query = static::query();
        return $query->where('id', '=', $id)->with('parentList')->first();
    }

}
