<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    protected $guarded = [];

    public function period()
    {
        return $this->belongsTo(Period::class);
    }

    public function division()
    {
        return $this->belongsTo(Division::class);
    }
}
