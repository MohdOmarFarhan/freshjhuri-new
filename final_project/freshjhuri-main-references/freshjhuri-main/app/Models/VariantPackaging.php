<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VariantPackaging extends Model
{
    protected $fillable = [
        'variant_id',
        'packaging_system',
        'max_per_package',
        'shipping_charge_per_package',
        'is_default',
    ];

    protected $casts = [
        'max_per_package' => 'integer',
        'shipping_charge_per_package' => 'decimal:2',
        'is_default' => 'boolean',
    ];

    public function variant()
    {
        return $this->belongsTo(Variant::class);
    }
}
