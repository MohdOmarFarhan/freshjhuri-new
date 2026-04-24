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
        'badge_en',
        'badge_bn',
        'slug',
        'feature_image',
        'hover_image',
        'video_url',
        'status',
        'is_free_shipping',
        'is_organic',
        'is_sugar_free',
        'is_pre_order',
        'is_top_selling',
        'description_en',
        'description_bn',
        'origin_story_en',
        'origin_story_bn',
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
        'is_organic' => 'boolean',
        'is_sugar_free' => 'boolean',
        'is_pre_order' => 'boolean',
        'is_top_selling' => 'boolean',
    ];

    public function sliderImages()
    {
        return $this->hasMany(SliderImage::class);
    }

    public function attributes()
    {
        return $this->hasMany(ProductAttribute::class);
    }

    public function nutritionFacts()
    {
        return $this->hasMany(ProductNutritionFact::class);
    }

    public function relations()
    {
        return $this->hasMany(ProductRelation::class);
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
