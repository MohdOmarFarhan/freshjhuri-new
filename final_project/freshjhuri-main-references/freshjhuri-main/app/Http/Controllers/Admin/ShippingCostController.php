<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Division;
use App\Models\ShippingCost;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShippingCostController extends Controller
{
    public function index(Request $request)
    {
        $query = ShippingCost::with(['division', 'district', 'thana']);

        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('division', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            })
                ->orWhereHas('district', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                })
                ->orWhereHas('thana', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
        }

        $shippingCosts = $query->get();

        return Inertia::render('Admin/Shipping/Index', [
            'shippingCosts' => $shippingCosts,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Shipping/Create', [
            'divisions' => Division::all(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'division_id' => 'required|exists:divisions,id',
            'district_id' => 'required|exists:districts,id',
            'thana_id' => 'required|exists:thanas,id|unique:shipping_costs,thana_id',
            'cost' => 'required|numeric|min:0',
        ]);

        ShippingCost::create($request->all());

        return redirect()->route('admin.shipping.index')->with('success', 'Shipping cost set successfully.');
    }

    public function edit(ShippingCost $shippingCost)
    {
        return Inertia::render('Admin/Shipping/Edit', [
            'shippingCost' => $shippingCost->load(['division', 'district', 'thana']),
            'divisions' => Division::all(),
        ]);
    }

    public function update(Request $request, ShippingCost $shippingCost)
    {
        $request->validate([
            'division_id' => 'required|exists:divisions,id',
            'district_id' => 'required|exists:districts,id',
            'thana_id' => 'required|exists:thanas,id|unique:shipping_costs,thana_id,'.$shippingCost->id,
            'cost' => 'required|numeric|min:0',
        ]);

        $shippingCost->update($request->all());

        return redirect()->route('admin.shipping.index')->with('success', 'Shipping cost updated successfully.');
    }

    public function destroy(ShippingCost $shippingCost)
    {
        $shippingCost->delete();

        return redirect()->route('admin.shipping.index')->with('success', 'Shipping cost deleted successfully.');
    }
}
