<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProductStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class ProductStatusController extends Controller
{
    public function index()
    {
        $productStatuses = ProductStatus::latest()->get();

        return Inertia::render('ProductStatus/Index', [
            'productStatuses' => $productStatuses,
        ]);
    }

    public function create()
    {
        return Inertia::render('ProductStatus/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name_en' => ['required', 'string', 'max:255', 'unique:product_statuses,name_en'],
            'name_bn' => ['required', 'string', 'max:255', 'unique:product_statuses,name_bn'],
        ]);

        ProductStatus::create($validated);

        return Redirect::route('product-statuses.index')->with('message', 'Product status created successfully.');
    }

    public function edit(ProductStatus $productStatus)
    {
        return Inertia::render('ProductStatus/Edit', [
            'productStatus' => $productStatus,
        ]);
    }

    public function update(Request $request, ProductStatus $productStatus)
    {
        $validated = $request->validate([
            'name_en' => ['required', 'string', 'max:255', 'unique:product_statuses,name_en,'.$productStatus->id],
            'name_bn' => ['required', 'string', 'max:255', 'unique:product_statuses,name_bn,'.$productStatus->id],
        ]);

        $productStatus->update($validated);

        return Redirect::route('product-statuses.index')->with('message', 'Product status updated successfully.');
    }

    public function delete(ProductStatus $productStatus)
    {
        $productStatus->delete();

        return Redirect::route('product-statuses.index')->with('message', 'Product status deleted successfully.');
    }
}
