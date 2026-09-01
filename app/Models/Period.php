<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Period extends Model
{
    protected $guarded = [];

    public function divisions()
    {
        return $this->hasMany(Division::class);
    }

    public function members()
    {
        return $this->hasMany(Member::class);
    }
}
