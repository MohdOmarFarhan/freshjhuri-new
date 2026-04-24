<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Footer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class FooterController extends Controller
{
    public function index()
    {
        $footers = Footer::latest()->get();

        return Inertia::render('Footer/Index', [
            'footers' => $footers,
        ]);
    }

    public function create()
    {
        return Inertia::render('Footer/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:4096',
            'description_en' => 'nullable|string',
            'description_bn' => 'nullable|string',
            'office_address_en' => 'nullable|string',
            'office_address_bn' => 'nullable|string',
            'mobile_en' => 'nullable|string',
            'mobile_bn' => 'nullable|string',
            'hotline_en' => 'nullable|string',
            'hotline_bn' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:4096',
            'copyright' => 'nullable|string',
        ]);

        $data = $request->except(['logo', 'image']);

        if ($request->hasFile('logo')) {
            $data['logo'] = $request->file('logo')->store('footer/logos', 'public');
        }

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('footer/images', 'public');
        }

        Footer::create($data);

        return Redirect::route('footer.index')->with('message', 'Footer item created successfully.');
    }

    public function edit(Footer $footer)
    {
        return Inertia::render('Footer/Edit', [
            'footer' => $footer,
        ]);
    }

    public function update(Request $request, Footer $footer)
    {
        $request->validate([
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:4096',
            'description_en' => 'nullable|string',
            'description_bn' => 'nullable|string',
            'office_address_en' => 'nullable|string',
            'office_address_bn' => 'nullable|string',
            'mobile_en' => 'nullable|string',
            'mobile_bn' => 'nullable|string',
            'hotline_en' => 'nullable|string',
            'hotline_bn' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:4096',
            'copyright' => 'nullable|string',
        ]);

        $data = $request->except(['logo', 'image']);

        if ($request->hasFile('logo')) {
            if ($footer->logo) {
                Storage::disk('public')->delete($footer->logo);
            }
            $data['logo'] = $request->file('logo')->store('footer/logos', 'public');
        }

        if ($request->hasFile('image')) {
            if ($footer->image) {
                Storage::disk('public')->delete($footer->image);
            }
            $data['image'] = $request->file('image')->store('footer/images', 'public');
        }

        $footer->update($data);

        return Redirect::route('footer.index')->with('message', 'Footer item updated successfully.');
    }

    public function delete(Footer $footer)
    {
        if ($footer->logo) {
            Storage::disk('public')->delete($footer->logo);
        }
        if ($footer->image) {
            Storage::disk('public')->delete($footer->image);
        }

        $footer->delete();

        return Redirect::route('footer.index')->with('message', 'Footer item deleted successfully.');
    }
}
