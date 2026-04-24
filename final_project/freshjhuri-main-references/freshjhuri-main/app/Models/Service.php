<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = [
        'title_en',
        'title_bn',
        'description_en',
        'description_bn',
        'benefits_en',
        'benefits_bn',
        'image',
        'video_url',
        'status',
        'sort_order',
    ];

    protected $casts = [
        'benefits_en' => 'array',
        'benefits_bn' => 'array',
        'status' => 'boolean',
        'sort_order' => 'integer',
    ];
}
