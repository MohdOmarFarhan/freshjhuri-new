<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bannar extends Model
{
    protected $fillable = [
        'title_en',
        'title_bn',
        'short_desc_en',
        'short_desc_bn',
        'long_desc_en',
        'long_desc_bn',
        'image',
        'category_id',
        'tag_en',
        'tag_bn',
        'theme_color',
        'btn_text_en',
        'btn_text_bn',
        'btn_link',
        'sort_order',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }
}
