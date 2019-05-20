<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PredefinedTask extends Model
{
    protected $fillable = [
        'title', 'user_id'
    ];
}
