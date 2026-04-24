<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactDetail extends Model
{
    protected $fillable = [
        'image',
        'phone',
        'whats_app',
        'email',
        'corporate_office_en',
        'corporate_office_bn',
        'local_office_1_en',
        'local_office_1_bn',
        'local_office_2_en',
        'local_office_2_bn',
        'local_office_3_en',
        'local_office_3_bn',
    ];
}
