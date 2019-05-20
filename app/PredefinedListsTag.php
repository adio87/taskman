<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PredefinedListsTag extends Model
{
    protected $fillable = [
        'list_id', 'tag_id'
    ];
}
