<?php

namespace App\Http\Controllers\Home;

use App\Http\Controllers\Controller;
use App\Models\ShippingChart;
use Inertia\Inertia;

class ShippingChargeController extends Controller
{
    public function index()
    {
        $shippingCharts = ShippingChart::query()
            ->orderBy('product_type')
            ->orderBy('product_condition')
            ->orderBy('product_size')
            ->get();

        return Inertia::render('Home/ShippingChargesPage', [
            'shippingCharts' => $shippingCharts,
        ]);
    }
}
