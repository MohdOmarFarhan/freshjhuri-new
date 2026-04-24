<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentMedia extends Model
{
    protected $fillable = [
        'name',
        'pay_number',
        'icon',
    ];
}
