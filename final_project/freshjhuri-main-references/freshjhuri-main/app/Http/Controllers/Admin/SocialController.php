<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Social;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SocialController extends Controller
{
    public function index(Request $request)
    {
        $query = Social::query();

        if ($request->search) {
            $query->where('name', 'like', '%'.$request->search.'%')
                ->orWhere('link', 'like', '%'.$request->search.'%');
        }

        $socials = $query->latest()->get();

        return Inertia::render('Social/Index', [
            'socials' => $socials,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Social/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'link' => 'required|url|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $data = $request->only(['name', 'link']);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('socials', 'public');
        }

        Social::create($data);

        return redirect()->route('social.index')->with('success', 'Social media created successfully.');
    }

    public function edit(Social $social)
    {
        return Inertia::render('Social/Edit', [
            'social' => $social,
        ]);
    }

    public function update(Request $request, Social $social)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'link' => 'required|url|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $data = $request->only(['name', 'link']);

        if ($request->hasFile('image')) {
            if ($social->image) {
                Storage::disk('public')->delete($social->image);
            }
            $data['image'] = $request->file('image')->store('socials', 'public');
        }

        $social->update($data);

        return redirect()->route('social.index')->with('success', 'Social media updated successfully.');
    }

    public function destroy(Social $social)
    {
        if ($social->image) {
            Storage::disk('public')->delete($social->image);
        }

        $social->delete();

        return redirect()->route('social.index')->with('success', 'Social media deleted successfully.');
    }
}
