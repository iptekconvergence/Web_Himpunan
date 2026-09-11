<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FooterLinkGroup extends Model
{
    protected $fillable = [
        'key',
        'label',
        'description',
        'order',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    /**
     * Get the links belonging to this group.
     */
    public function links(): HasMany
    {
        return $this->hasMany(FooterLink::class)->orderBy('order')->orderBy('id');
    }
}
