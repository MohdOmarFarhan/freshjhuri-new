<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Variant extends Model
{
    protected $fillable = [
        'category_id',
        'product_id',
        'size_id',
        'sku',
        'stock',
        'price',
        'discount_price',
        'product_type',
    ];

    protected $casts = [
        'product_type' => 'array',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function size()
    {
        return $this->belongsTo(Size::class);
    }

    public function packagings()
    {
        return $this->hasMany(VariantPackaging::class);
    }

    public function comboItems()
    {
        return $this->hasMany(ComboVariantItem::class, 'combo_variant_id');
    }
}
