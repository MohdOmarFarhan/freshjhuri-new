<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::where('user_id', Auth::id())
            ->with(['shippingAddress'])
            ->latest()
            ->get();

        return Inertia::render('User/Order/Index', [
            'orders' => $orders,
        ]);
    }

    public function show(Order $order)
    {
        abort_if((int) $order->user_id != (int) Auth::id(), 403);

        $order->load([
            'items.variant.product',
            'items.variant.size',
            'items.review',
            'shippingAddress.division',
            'shippingAddress.district',
            'shippingAddress.thana',
        ]);

        return Inertia::render('User/Order/Show', [
            'order' => $order,
        ]);
    }

    public function print(Order $order)
    {
        $order->load(['items.variant.product', 'items.variant.size', 'shippingAddress.division', 'shippingAddress.district', 'shippingAddress.thana']);

        return Inertia::render('Order/Print', [
            'order' => $order,
        ]);
    }
}
