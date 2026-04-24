<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BrandMarquee extends Model
{
    protected $fillable = [
        'text_en',
        'text_bn',
        'icon',
        'image',
        'color',
        'bg_color',
        'sort_order',
        'status',
    ];
}
