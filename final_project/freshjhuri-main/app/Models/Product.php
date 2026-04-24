<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'category_id',
        'product_status_id',
        'title_en',
        'title_bn',
        'short_desc_en',
        'short_desc_bn',
        'slug',
        'feature_image',
        'hover_image',
        'status',
        'is_free_shipping',
        'description_en',
        'description_bn',
        'conservation_en',
        'conservation_bn',
        'sort_order',
        'season',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function productStatus()
    {
        return $this->belongsTo(ProductStatus::class);
    }

    protected $casts = [
        'is_free_shipping' => 'boolean',
    ];

    public function sliderImages()
    {
        return $this->hasMany(SliderImage::class);
    }

    public function productFeatures()
    {
        return $this->hasMany(ProductFeature::class);
    }

    public function variants()
    {
        return $this->hasMany(Variant::class);
    }

    public function reviews()
    {
        return $this->hasMany(ProductReview::class);
    }
}
