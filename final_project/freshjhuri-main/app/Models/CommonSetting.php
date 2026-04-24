<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CommonSetting extends Model
{
    protected $fillable = [
        'project_name',
        'logo_1',
        'logo_2',
        'slogan',
        'est',
        'email',
        'phone',
        'whatsapp',
        'address',
        'copyright',
        'developer_logo',
        'banner_image',
        'facebook_pixel',
    ];
}
