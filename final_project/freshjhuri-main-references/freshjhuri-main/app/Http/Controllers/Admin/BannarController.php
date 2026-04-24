<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Bannar;
use App\Services\ImageConversionService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class BannarController extends Controller
{
    public function index()
    {
        $bannars = Bannar::latest()->paginate(10)->withQueryString();

        return Inertia::render('Bannar/Index', [
            'bannars' => $bannars,
        ]);
    }

    public function create()
    {
        $categories = \App\Models\Category::select('id', 'name_en', 'slug')->orderBy('name_en')->get();
        return Inertia::render('Bannar/Create', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title_en' => 'required|string|max:255',
            'title_bn' => 'required|string|max:255',
            'short_desc_en' => 'nullable|string',
            'short_desc_bn' => 'nullable|string',
            'long_desc_en' => 'nullable|string',
            'long_desc_bn' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp,bmp|max:2048',
        ]);

        $data = [
            'title_en' => $request->title_en,
            'title_bn' => $request->title_bn,
            'short_desc_en' => $request->short_desc_en,
            'short_desc_bn' => $request->short_desc_bn,
            'long_desc_en' => $request->long_desc_en,
            'long_desc_bn' => $request->long_desc_bn,
            'category_id' => $request->category_id,
        ];

        if ($request->hasFile('image')) {
            try {
                $data['image'] = ImageConversionService::convertToWebP($request->file('image'), 'bannars', 85);
            } catch (Exception $exception) {
                return Redirect::back()->withErrors([
                    'image' => 'Image processing failed. Please try another file.',
                ])->withInput();
            }
        }

        Bannar::create($data);

        return Redirect::route('bannars.index')->with('message', 'Bannar created successfully.');
    }

    public function edit(Bannar $bannar)
    {
        $categories = \App\Models\Category::select('id', 'name_en', 'slug')->orderBy('name_en')->get();
        return Inertia::render('Bannar/Edit', [
            'bannar' => $bannar,
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, Bannar $bannar)
    {
        $request->validate([
            'title_en' => 'required|string|max:255',
            'title_bn' => 'required|string|max:255',
            'short_desc_en' => 'nullable|string',
            'short_desc_bn' => 'nullable|string',
            'long_desc_en' => 'nullable|string',
            'long_desc_bn' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,bmp|max:2048',
        ]);

        $data = [
            'title_en' => $request->title_en,
            'title_bn' => $request->title_bn,
            'short_desc_en' => $request->short_desc_en,
            'short_desc_bn' => $request->short_desc_bn,
            'long_desc_en' => $request->long_desc_en,
            'long_desc_bn' => $request->long_desc_bn,
            'category_id' => $request->category_id,
        ];

        if ($request->hasFile('image')) {
            if ($bannar->image) {
                ImageConversionService::deleteImage($bannar->image);
            }

            try {
                $data['image'] = ImageConversionService::convertToWebP($request->file('image'), 'bannars', 85);
            } catch (Exception $exception) {
                return Redirect::back()->withErrors([
                    'image' => 'Image processing failed. Please try another file.',
                ])->withInput();
            }
        }

        $bannar->update($data);

        return Redirect::route('bannars.index')->with('message', 'Bannar updated successfully.');
    }

    public function delete(Bannar $bannar)
    {
        if ($bannar->image) {
            ImageConversionService::deleteImage($bannar->image);
        }

        $bannar->delete();

        return Redirect::route('bannars.index')->with('message', 'Bannar deleted successfully.');
    }
}
