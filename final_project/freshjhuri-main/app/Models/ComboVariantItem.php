<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ComboVariantItem extends Model
{
    protected $fillable = [
        'combo_variant_id',
        'included_variant_id',
        'qty',
    ];

    protected $casts = [
        'qty' => 'integer',
    ];

    public function comboVariant()
    {
        return $this->belongsTo(Variant::class, 'combo_variant_id');
    }

    public function includedVariant()
    {
        return $this->belongsTo(Variant::class, 'included_variant_id');
    }
}

