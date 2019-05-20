<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\Sluggable;

class Subfolder extends Model
{
    use Sluggable;

    protected $fillable = [
        'title', 'user_id', 'order'
    ];

    public function lists()
    {
        return $this->hasMany('App\Lists')->orderBy('order', 'asc');
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
