<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Size extends Model
{
    protected $fillable = [
        'unit_en',
        'unit_bn',
        'amount_en',
        'amount_bn',
    ];
}
