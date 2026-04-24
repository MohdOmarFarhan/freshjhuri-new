<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Thana;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShippingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Thana::with(['district.division']);

        if ($request->has('search')) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('bn_name', 'like', "%{$search}%")
                ->orWhereHas('district', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhereHas('division', function ($d) use ($search) {
                            $d->where('name', 'like', "%{$search}%");
                        });
                });
        }

        $thanas = $query->paginate(10)->withQueryString();

        return Inertia::render('Shipping/Index', [
            'thanas' => $thanas,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Thana $thana)
    {
        $thana->load('district.division');

        return Inertia::render('Shipping/Edit', [
            'thana' => $thana,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Thana $thana)
    {
        $request->validate([
            'shipping_cost' => 'required|numeric|min:0',
        ]);

        $thana->update([
            'shipping_cost' => $request->shipping_cost,
        ]);

        return redirect()->route('admin.shipping.index')->with('success', 'Shipping cost updated successfully.');
    }
}
