<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    protected $guarded = [];

    public function category()
    {
        return $this->belongsTo(NewsCategory::class, 'news_category_id');
    }
}
