<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'subtotal',
        'pay_amount',
        'shipping_cost',
        'due_amount',
        'special_discount',
        'has_free_shipping',
        'notes',
        'admin_note',
        'status',
        'payment_type',
    ];

    protected $casts = [
        'has_free_shipping' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function shippingAddress()
    {
        return $this->hasOne(ShippingAddress::class);
    }
}
