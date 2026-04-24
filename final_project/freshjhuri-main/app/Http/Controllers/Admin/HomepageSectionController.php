<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\HomepageSection;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomepageSectionController extends Controller
{
    public function index()
    {
        $sections = HomepageSection::with('category')->orderBy('sort_order')->paginate(10);
        return Inertia::render('HomepageSection/Index', [
            'sections' => $sections
        ]);
    }

    public function create()
    {
        $categories = Category::select('id', 'name_en', 'name_bn')->get();
        return Inertia::render('HomepageSection/Create', [
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title_en' => 'required|string|max:255',
            'title_bn' => 'required|string|max:255',
            'subtitle_en' => 'nullable|string|max:255',
            'subtitle_bn' => 'nullable|string|max:255',
            'type' => 'required|string|in:featured,best-selling,new-arrival,combo,category',
            'category_id' => 'nullable|required_if:type,category|exists:categories,id',
            'theme_color' => 'nullable|string',
            'sort_order' => 'nullable|integer',
            'status' => 'boolean',
        ]);

        HomepageSection::create($request->all());

        return redirect()->route('homepage-sections.index')->with('message', 'Homepage Section created successfully.');
    }

    public function edit(HomepageSection $homepageSection)
    {
        $categories = Category::select('id', 'name_en', 'name_bn')->get();
        return Inertia::render('HomepageSection/Edit', [
            'section' => $homepageSection,
            'categories' => $categories
        ]);
    }

    public function update(Request $request, HomepageSection $homepageSection)
    {
        $request->validate([
            'title_en' => 'required|string|max:255',
            'title_bn' => 'required|string|max:255',
            'subtitle_en' => 'nullable|string|max:255',
            'subtitle_bn' => 'nullable|string|max:255',
            'type' => 'required|string|in:featured,best-selling,new-arrival,combo,category',
            'category_id' => 'nullable|required_if:type,category|exists:categories,id',
            'theme_color' => 'nullable|string',
            'sort_order' => 'nullable|integer',
            'status' => 'boolean',
        ]);

        $homepageSection->update($request->all());

        return redirect()->route('homepage-sections.index')->with('message', 'Homepage Section updated successfully.');
    }

    public function destroy(HomepageSection $homepageSection)
    {
        $homepageSection->delete();
        return redirect()->route('homepage-sections.index')->with('message', 'Homepage Section deleted successfully.');
    }
}
