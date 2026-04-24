<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Size;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class SizeController extends Controller
{
    public function index()
    {
        $sizes = Size::latest()->get();

        return Inertia::render('Size/Index', [
            'sizes' => $sizes,
        ]);
    }

    public function create()
    {
        return Inertia::render('Size/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'unit_en' => ['required', 'string', 'max:255'],
            'unit_bn' => ['required', 'string', 'max:255'],
            'amount_en' => ['required', 'string', 'max:255'],
            'amount_bn' => ['required', 'string', 'max:255'],
        ]);

        Size::create($validated);

        return Redirect::route('sizes.index')->with('message', 'Size created successfully.');
    }

    public function edit(Size $size)
    {
        return Inertia::render('Size/Edit', [
            'size' => $size,
        ]);
    }

    public function update(Request $request, Size $size)
    {
        $validated = $request->validate([
            'unit_en' => ['required', 'string', 'max:255'],
            'unit_bn' => ['required', 'string', 'max:255'],
            'amount_en' => ['required', 'string', 'max:255'],
            'amount_bn' => ['required', 'string', 'max:255'],
        ]);

        $size->update($validated);

        return Redirect::route('sizes.index')->with('message', 'Size updated successfully.');
    }

    public function delete(Size $size)
    {
        $size->delete();

        return Redirect::route('sizes.index')->with('message', 'Size deleted successfully.');
    }
}
