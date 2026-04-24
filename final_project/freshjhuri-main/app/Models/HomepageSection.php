<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HomepageSection extends Model
{
    protected $fillable = [
        'title_en',
        'title_bn',
        'subtitle_en',
        'subtitle_bn',
        'type',
        'category_id',
        'theme_color',
        'sort_order',
        'status',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
