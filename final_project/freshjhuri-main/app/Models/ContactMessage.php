<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    protected $fillable = [
        'email',
        'phone',
        'whatsapp',
        'message_en',
        'message_bn',
    ];
}
