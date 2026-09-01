<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Division extends Model
{
    protected $guarded = [];

    public function period()
    {
        return $this->belongsTo(Period::class);
    }

    public function members()
    {
        return $this->hasMany(Member::class);
    }
}
