<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShippingChart extends Model
{
    protected $fillable = [
        'product_type',
        'product_condition',
        'product_size',
        'product_size_en',
        'product_size_bn',
        'cutton_contain_amount',
        'shpping_charge_per_cutton',
    ];

    protected $casts = [
        'cutton_contain_amount' => 'integer',
        'shpping_charge_per_cutton' => 'decimal:2',
    ];
}
