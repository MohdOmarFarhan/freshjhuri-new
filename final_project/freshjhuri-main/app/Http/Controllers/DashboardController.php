<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Models\Visitor;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $stats = [];
        $recentOrders = [];
        $recentMessages = [];

        // Admin Stats (Check if user has permission to view orders/products)
        if ($user->can('ORDER_INDEX')) {
            $stats['total_orders'] = Order::count();
            $stats['total_sales'] = Order::sum('pay_amount');
            $stats['today_sales'] = Order::whereDate('created_at', today())->sum('pay_amount');
            $stats['pending_orders'] = Order::where('status', 'Pending')->count();

            // Visitor Stats
            $stats['total_visitors'] = Visitor::count();
            $stats['today_visitors'] = Visitor::where('visited_date', today())->count();

            $recentOrders = Order::with('user')->latest()->take(5)->get();
        }

        if ($user->can('PRODUCT_INDEX')) {
            $stats['total_products'] = Product::count();
            $stats['low_stock_products'] = Product::whereHas('variants', function ($q) {
                $q->where('stock', '<', 10);
            })->count();
        }

        if ($user->can('USER_INDEX')) {
            $stats['total_users'] = User::count();
        }

        if ($user->can('CONTACT_MESSAGE_INDEX')) {
            $stats['unread_messages'] = ContactMessage::count(); // Assuming all are unread for now or just total
            $recentMessages = ContactMessage::latest()->take(5)->get();
        }

        // Customer Stats
        if (! $user->hasRole(['Super Admin', 'Admin'])) {
            $stats['my_orders'] = Order::where('user_id', $user->id)->count();
            $stats['my_spent'] = Order::where('user_id', $user->id)->sum('pay_amount');
            $recentOrders = Order::where('user_id', $user->id)->latest()->take(5)->get();
        }

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recentOrders' => $recentOrders,
            'recentMessages' => $recentMessages,
            'isAdmin' => $user->can('ORDER_INDEX'), // Simple check for admin view
        ]);
    }
}
