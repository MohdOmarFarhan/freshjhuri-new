<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ShippingChart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ShippingChartController extends Controller
{
    public function index()
    {
        $shippingCharts = ShippingChart::query()
            ->orderBy('product_type')
            ->orderBy('product_condition')
            ->orderBy('product_size')
            ->get();

        return Inertia::render('Admin/ShippingCharts/Index', [
            'shippingCharts' => $shippingCharts,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/ShippingCharts/Create');
    }

    public function store(Request $request)
    {
        $validated = $this->validatePayload($request);

        $exists = ShippingChart::query()
            ->where('product_type', $validated['product_type'])
            ->where('product_condition', $validated['product_condition'])
            ->where('product_size', $validated['product_size'])
            ->exists();

        if ($exists) {
            return Redirect::back()->withErrors([
                'product_condition' => 'This type and condition already exists.',
            ]);
        }

        ShippingChart::create($validated);

        return Redirect::route('admin.shipping-charts.index')->with('success', 'Shipping chart created successfully.');
    }

    public function edit(ShippingChart $shippingChart)
    {
        return Inertia::render('Admin/ShippingCharts/Edit', [
            'shippingChart' => $shippingChart,
        ]);
    }

    public function update(Request $request, ShippingChart $shippingChart)
    {
        $validated = $this->validatePayload($request);

        $exists = ShippingChart::query()
            ->where('id', '!=', $shippingChart->id)
            ->where('product_type', $validated['product_type'])
            ->where('product_condition', $validated['product_condition'])
            ->where('product_size', $validated['product_size'])
            ->exists();

        if ($exists) {
            return Redirect::back()->withErrors([
                'product_condition' => 'This type and condition already exists.',
            ]);
        }

        $shippingChart->update($validated);

        return Redirect::route('admin.shipping-charts.index')->with('success', 'Shipping chart updated successfully.');
    }

    public function destroy(ShippingChart $shippingChart)
    {
        $shippingChart->delete();

        return Redirect::route('admin.shipping-charts.index')->with('success', 'Shipping chart deleted successfully.');
    }

    private function validatePayload(Request $request): array
    {
        $validated = $request->validate([
            'product_type' => ['required', 'in:Feed,Medicine,Bag'],
            'product_condition' => ['required', 'in:Solid,Liquid,Number'],
            'product_size' => ['nullable', 'string', 'max:50'],
            'product_size_en' => ['nullable', 'string', 'max:50'],
            'product_size_bn' => ['nullable', 'string', 'max:50'],
            'cutton_contain_amount' => ['nullable', 'integer', 'min:0'],
            'shpping_charge_per_cutton' => ['required', 'numeric', 'min:0'],
        ]);

        $type = $validated['product_type'];
        $condition = $validated['product_condition'];

        if (in_array($type, ['Feed', 'Bag'], true) && $condition !== 'Number') {
            throw ValidationException::withMessages([
                'product_condition' => 'Feed/Bag must use Number condition.',
            ]);
        }

        if ($type === 'Medicine' && ! in_array($condition, ['Solid', 'Liquid'], true)) {
            throw ValidationException::withMessages([
                'product_condition' => 'Medicine must use Solid or Liquid condition.',
            ]);
        }

        if ($condition === 'Number') {
            $validated['product_size'] = null;
            $validated['product_size_en'] = null;
            $validated['product_size_bn'] = null;
            $validated['cutton_contain_amount'] = null;
        }

        if ($type !== 'Medicine') {
            $validated['product_size'] = null;
            $validated['product_size_en'] = null;
            $validated['product_size_bn'] = null;
        }

        if ($type === 'Medicine' && empty($validated['product_size_en'])) {
            throw ValidationException::withMessages([
                'product_size_en' => 'Product size (EN) is required for Medicine.',
            ]);
        }

        if ($type === 'Medicine' && empty($validated['product_size_bn'])) {
            throw ValidationException::withMessages([
                'product_size_bn' => 'Product size (BN) is required for Medicine.',
            ]);
        }

        if ($type === 'Medicine') {
            $validated['product_size'] = $validated['product_size_en'];
        }

        if (in_array($condition, ['Solid', 'Liquid'], true) && empty($validated['cutton_contain_amount'])) {
            throw ValidationException::withMessages([
                'cutton_contain_amount' => 'Carton contain amount is required for Solid/Liquid.',
            ]);
        }

        return $validated;
    }
}
