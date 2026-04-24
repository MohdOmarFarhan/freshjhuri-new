<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\HomepageSection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class HomepageSectionController extends Controller
{
    public function index()
    {
        $sections = HomepageSection::with('category')
            ->orderBy('sort_order')
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('HomepageSection/Index', [
            'sections' => $sections,
        ]);
    }

    public function create()
    {
        $categories = Category::select('id', 'name_en', 'name_bn')
            ->orderBy('name_en')
            ->get();

        return Inertia::render('HomepageSection/Create', [
            'categories' => $categories,
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
            'status' => 'nullable|boolean',
        ]);

        $data = [
            'title_en' => $request->title_en,
            'title_bn' => $request->title_bn,
            'subtitle_en' => $request->subtitle_en,
            'subtitle_bn' => $request->subtitle_bn,
            'type' => $request->type,
            'category_id' => $request->type === 'category' ? $request->category_id : null,
            'theme_color' => $request->input('theme_color', '#f59e0b'),
            'sort_order' => $request->input('sort_order', 0),
            'status' => $request->boolean('status', true),
        ];

        HomepageSection::create($data);

        return Redirect::route('homepage-sections.index')->with('message', 'Homepage Section created successfully.');
    }

    public function edit(HomepageSection $homepageSection)
    {
        $categories = Category::select('id', 'name_en', 'name_bn')
            ->orderBy('name_en')
            ->get();

        return Inertia::render('HomepageSection/Edit', [
            'section' => $homepageSection,
            'categories' => $categories,
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
            'status' => 'nullable|boolean',
        ]);

        $data = [
            'title_en' => $request->title_en,
            'title_bn' => $request->title_bn,
            'subtitle_en' => $request->subtitle_en,
            'subtitle_bn' => $request->subtitle_bn,
            'type' => $request->type,
            'category_id' => $request->type === 'category' ? $request->category_id : null,
            'theme_color' => $request->input('theme_color', '#f59e0b'),
            'sort_order' => $request->input('sort_order', 0),
            'status' => $request->boolean('status', true),
        ];

        $homepageSection->update($data);

        return Redirect::route('homepage-sections.index')->with('message', 'Homepage Section updated successfully.');
    }

    public function destroy(HomepageSection $homepageSection)
    {
        $homepageSection->delete();
        return Redirect::route('homepage-sections.index')->with('message', 'Homepage Section deleted successfully.');
    }
}
