<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = [
        'name_en',
        'name_bn',
        'desc_en',
        'desc_bn',
        'is_featured',
        'slug',
        'image',
        'status',
        'sort_order',
    ];

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
