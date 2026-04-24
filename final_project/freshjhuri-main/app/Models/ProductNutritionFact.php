<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductNutritionFact extends Model
{
    protected $fillable = [
        'product_id',
        'name_en',
        'name_bn',
        'value',
        'unit',
        'per_quantity',
        'per_unit',
        'sort_order',
    ];

    protected $casts = [
        'per_quantity' => 'decimal:2',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}

