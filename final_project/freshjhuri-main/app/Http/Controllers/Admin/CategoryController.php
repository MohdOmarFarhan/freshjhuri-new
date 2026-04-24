<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Services\ImageConversionService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::orderBy('sort_order')->orderByDesc('id')->paginate(10)->withQueryString();

        return Inertia::render('Category/Index', [
            'categories' => $categories,
        ]);
    }

    public function create()
    {
        return Inertia::render('Category/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name_en' => 'required|string|max:255',
            'name_bn' => 'required|string|max:255',
            'desc_en' => 'nullable|string',
            'desc_bn' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,bmp|max:2048',
            'is_featured' => 'nullable|boolean',
            'status' => 'required|boolean',
            'sort_order' => 'nullable|integer',
        ]);

        $data = [
            'name_en' => $request->name_en,
            'name_bn' => $request->name_bn,
            'desc_en' => $request->desc_en,
            'desc_bn' => $request->desc_bn,
            'slug' => Str::slug($request->name_en),
            'is_featured' => $request->boolean('is_featured'),
            'status' => $request->boolean('status'),
            'sort_order' => $request->input('sort_order', 0),
        ];

        // Ensure unique slug
        $count = Category::where('slug', $data['slug'])->count();
        if ($count > 0) {
            $data['slug'] = $data['slug'] . '-' . ($count + 1);
        }

        if ($request->hasFile('image')) {
            try {
                $data['image'] = ImageConversionService::convertToWebP($request->file('image'), 'categories', 85);
            } catch (Exception $exception) {
                return Redirect::back()->withErrors([
                    'image' => 'IMAGE_PROCESSING_FAILED',
                ])->withInput();
            }
        }

        Category::create($data);

        return Redirect::route('categories.index')->with('message', 'Category created successfully.');
    }

    public function edit(Category $category)
    {
        return Inertia::render('Category/Edit', [
            'category' => $category,
        ]);
    }

    public function update(Request $request, Category $category)
    {
        $request->validate([
            'name_en' => 'required|string|max:255',
            'name_bn' => 'required|string|max:255',
            'desc_en' => 'nullable|string',
            'desc_bn' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,bmp|max:2048',
            'is_featured' => 'nullable|boolean',
            'status' => 'required|boolean',
            'sort_order' => 'nullable|integer',
        ]);

        $data = [
            'name_en' => $request->name_en,
            'name_bn' => $request->name_bn,
            'desc_en' => $request->desc_en,
            'desc_bn' => $request->desc_bn,
            'is_featured' => $request->boolean('is_featured'),
            'status' => $request->boolean('status'),
            'sort_order' => $request->input('sort_order', 0),
        ];

        // Update slug only if name_en has changed
        if ($category->name_en !== $request->name_en) {
            $newSlug = Str::slug($request->name_en);

            // Check if slug exists (excluding current category)
            $count = Category::where('slug', $newSlug)
                ->where('id', '!=', $category->id)
                ->count();

            if ($count > 0) {
                $data['slug'] = $newSlug . '-' . ($count + 1);
            } else {
                $data['slug'] = $newSlug;
            }
        }

        if ($request->hasFile('image')) {
            if ($category->image) {
                ImageConversionService::deleteImage($category->image);
            }

            try {
                $data['image'] = ImageConversionService::convertToWebP($request->file('image'), 'categories', 85);
            } catch (Exception $exception) {
                return Redirect::back()->withErrors([
                    'image' => 'IMAGE_PROCESSING_FAILED',
                ])->withInput();
            }
        }

        $category->update($data);

        return Redirect::route('categories.index')->with('message', 'Category updated successfully.');
    }

    public function delete(Category $category)
    {
        if ($category->image) {
            ImageConversionService::deleteImage($category->image);
        }

        $category->delete();

        return Redirect::route('categories.index')->with('message', 'Category deleted successfully.');
    }
}
