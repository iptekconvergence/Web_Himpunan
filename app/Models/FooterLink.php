<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FooterLink extends Model
{
    protected $fillable = [
        'footer_link_group_id',
        'label',
        'url',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    /**
     * Get the group this link belongs to.
     */
    public function group(): BelongsTo
    {
        return $this->belongsTo(FooterLinkGroup::class, 'footer_link_group_id');
    }
}
