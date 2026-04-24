<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceVideo extends Model
{
    protected $fillable = [
        'title_en',
        'title_bn',
        'video_link',
        'status',
    ];

    protected $casts = [
        'status' => 'boolean',
    ];
}
