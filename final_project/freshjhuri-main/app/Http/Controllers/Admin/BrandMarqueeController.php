<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BrandMarquee;
use App\Services\ImageConversionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class BrandMarqueeController extends Controller
{
    public function index()
    {
        $marquees = BrandMarquee::orderBy('sort_order')
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('BrandMarquee/Index', [
            'marquees' => $marquees,
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
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,bmp|max:4096',
            'image_url' => 'nullable|url|max:2048',
            'color' => 'nullable|string',
            'bg_color' => 'nullable|string',
            'sort_order' => 'nullable|integer',
            'status' => 'nullable|boolean',
        ]);

        $data = [
            'text_en' => $request->text_en,
            'text_bn' => $request->text_bn,
            'icon' => $request->filled('icon') ? $request->icon : null,
            'color' => $request->color,
            'bg_color' => $request->bg_color,
            'sort_order' => $request->input('sort_order', 0),
            'status' => $request->boolean('status', true),
        ];

        $data['image'] = $this->resolveMarqueeImage($request);

        BrandMarquee::create($data);

        return Redirect::route('brand-marquees.index')->with('message', 'Brand Marquee created successfully.');
    }

    public function edit(BrandMarquee $brandMarquee)
    {
        return Inertia::render('BrandMarquee/Edit', [
            'marquee' => $brandMarquee,
        ]);
    }

    public function update(Request $request, BrandMarquee $brandMarquee)
    {
        $request->validate([
            'text_en' => 'required|string|max:255',
            'text_bn' => 'required|string|max:255',
            'icon' => 'nullable|string',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,bmp|max:4096',
            'image_url' => 'nullable|url|max:2048',
            'remove_image' => 'nullable|boolean',
            'color' => 'nullable|string',
            'bg_color' => 'nullable|string',
            'sort_order' => 'nullable|integer',
            'status' => 'nullable|boolean',
        ]);

        $data = [
            'text_en' => $request->text_en,
            'text_bn' => $request->text_bn,
            'icon' => $request->filled('icon') ? $request->icon : null,
            'color' => $request->color,
            'bg_color' => $request->bg_color,
            'sort_order' => $request->input('sort_order', 0),
            'status' => $request->boolean('status', true),
        ];

        if ($request->boolean('remove_image')) {
            $this->deleteMarqueeImage($brandMarquee->image);
            $data['image'] = null;
        } elseif ($request->hasFile('image_file') || $request->filled('image_url')) {
            $this->deleteMarqueeImage($brandMarquee->image);
            $data['image'] = $this->resolveMarqueeImage($request);
        }

        $brandMarquee->update($data);

        return Redirect::route('brand-marquees.index')->with('message', 'Brand Marquee updated successfully.');
    }

    public function destroy(BrandMarquee $brandMarquee)
    {
        $this->deleteMarqueeImage($brandMarquee->image);
        $brandMarquee->delete();

        return Redirect::route('brand-marquees.index')->with('message', 'Brand Marquee deleted successfully.');
    }

    private function resolveMarqueeImage(Request $request): ?string
    {
        if ($request->hasFile('image_file')) {
            return ImageConversionService::convertToWebP($request->file('image_file'), 'brand-marquees', 85);
        }

        if ($request->filled('image_url')) {
            return $request->image_url;
        }

        return null;
    }

    private function deleteMarqueeImage(?string $path): void
    {
        if (! $path) {
            return;
        }

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://') || str_starts_with($path, '/ui/')) {
            return;
        }

        ImageConversionService::deleteImage($path);
    }
}
