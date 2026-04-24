<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Footer extends Model
{
    protected $fillable = [
        'logo',
        'description_en',
        'description_bn',
        'office_address_en',
        'office_address_bn',
        'mobile_en',
        'mobile_bn',
        'hotline_en',
        'hotline_bn',
        'image',
        'copyright',
    ];
}
