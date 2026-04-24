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
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }
}
