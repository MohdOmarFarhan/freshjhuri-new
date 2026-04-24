<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BrandMarquee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BrandMarqueeController extends Controller
{
    public function index()
    {
        $marquees = BrandMarquee::orderBy('sort_order')->paginate(10);
        return Inertia::render('BrandMarquee/Index', [
            'marquees' => $marquees
        ]);
    }

    public function create()
    {
        return Inertia::render('BrandMarquee/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'text_en' => 'required|string|max:255',
            'text_bn' => 'required|string|max:255',
            'icon' => 'nullable|string',
            'color' => 'nullable|string',
            'bg_color' => 'nullable|string',
            'sort_order' => 'nullable|integer',
        ]);

        BrandMarquee::create($request->all());

        return redirect()->route('brand-marquees.index')->with('message', 'Brand Marquee created successfully.');
    }

    public function edit($id)
    {
        $marquee = BrandMarquee::findOrFail($id);
        return Inertia::render('BrandMarquee/Edit', [
            'marquee' => $marquee
        ]);
    }

    public function update(Request $request, $id)
    {
        $marquee = BrandMarquee::findOrFail($id);

        $request->validate([
            'text_en' => 'required|string|max:255',
            'text_bn' => 'required|string|max:255',
            'icon' => 'nullable|string',
            'color' => 'nullable|string',
            'bg_color' => 'nullable|string',
            'sort_order' => 'nullable|integer',
        ]);

        $marquee->update($request->all());

        return redirect()->route('brand-marquees.index')->with('message', 'Brand Marquee updated successfully.');
    }

    public function destroy($id)
    {
        $marquee = BrandMarquee::findOrFail($id);
        $marquee->delete();

        return redirect()->route('brand-marquees.index')->with('message', 'Brand Marquee deleted successfully.');
    }
}
