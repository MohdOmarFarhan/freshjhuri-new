<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductFeature;
use App\Models\SliderImage;
use App\Services\ImageConversionService;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with(['category'])
            ->withCount(['productFeatures', 'sliderImages'])
            ->orderBy('sort_order')
            ->orderByDesc('id')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Products/Index', [
            'products' => $products,
        ]);
    }

    public function show(Product $product)
    {
        $relations = ['category', 'productFeatures', 'sliderImages'];

        if (Schema::hasTable('product_statuses')) {
            $relations[] = 'productStatus';
        }

        $product->load($relations);

        return Inertia::render('Products/Show', [
            'product' => $product,
        ]);
    }

    public function create()
    {
        $categories = Category::select('id', 'name_en', 'name_bn')->orderBy('name_en')->get();

        return Inertia::render('Products/Create', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'title_en' => ['required', 'string', 'max:255'],
            'title_bn' => ['required', 'string', 'max:255'],
            'short_desc_en' => ['nullable', 'string'],
            'short_desc_bn' => ['nullable', 'string'],
            'description_en' => ['nullable', 'string'],
            'description_bn' => ['nullable', 'string'],
            'conservation_en' => ['nullable', 'string'],
            'conservation_bn' => ['nullable', 'string'],
            'status' => ['required', 'boolean'],
            'is_free_shipping' => ['boolean'],
            'sort_order' => ['nullable', 'integer'],
            'season' => ['required', 'in:upcoming,ongoing,outofseason'],
            'feature_image' => ['nullable', 'image', 'max:4096'],
            'hover_image' => ['nullable', 'image', 'max:4096'],

            'features' => ['array'],
            'features.*.feature_en' => ['required_with:features', 'string', 'max:255'],
            'features.*.feature_bn' => ['required_with:features', 'string', 'max:255'],

            'slider_images' => ['array'],
            'slider_images.*' => ['image', 'max:4096'],
        ]);

        DB::transaction(function () use ($request, $data) {
            $productData = collect($data)->only([
                'category_id',
                'title_en',
                'title_bn',
                'short_desc_en',
                'short_desc_bn',
                'description_en',
                'description_bn',
                'conservation_en',
                'conservation_bn',
                'status',
                'is_free_shipping',
                'sort_order',
                'season',
            ])->toArray();

            $productData['slug'] = Str::slug($data['title_en']);

            if ($request->hasFile('feature_image')) {
                $productData['feature_image'] = $this->storeProductImage($request->file('feature_image'), 'products/feature');
            }

            if ($request->hasFile('hover_image')) {
                $productData['hover_image'] = $this->storeProductImage($request->file('hover_image'), 'products/hover');
            }

            $product = Product::create($productData);

            foreach ($data['features'] ?? [] as $item) {
                ProductFeature::create([
                    'product_id' => $product->id,
                    'feature_en' => $item['feature_en'],
                    'feature_bn' => $item['feature_bn'],
                ]);
            }

            if ($request->hasFile('slider_images')) {
                foreach ($request->file('slider_images') as $file) {
                    if (! $file) {
                        continue;
                    }
                    SliderImage::create([
                        'product_id' => $product->id,
                        'slider_image' => $this->storeProductImage($file, 'products/slider'),
                    ]);
                }
            }
        });

        return to_route('products.index')->with('success', 'Product created successfully.');
    }

    public function edit(Product $product)
    {
        $product->load([
            'productFeatures:id,product_id,feature_en,feature_bn',
            'sliderImages:id,product_id,slider_image',
        ]);

        $productData = [
            'id' => $product->id,
            'category_id' => $product->category_id,
            'title_en' => $product->title_en,
            'title_bn' => $product->title_bn,
            'short_desc_en' => $product->short_desc_en,
            'short_desc_bn' => $product->short_desc_bn,
            'conservation_en' => $product->conservation_en,
            'conservation_bn' => $product->conservation_bn,
            'description_en' => $product->description_en,
            'description_bn' => $product->description_bn,
            'status' => $product->status,
            'is_free_shipping' => $product->is_free_shipping,
            'sort_order' => $product->sort_order,
            'season' => $product->season,
            'feature_image' => $product->feature_image,
            'hover_image' => $product->hover_image,
            'product_features' => $product->productFeatures,
            'slider_images' => $product->sliderImages,
        ];

        $categories = Category::select('id', 'name_en', 'name_bn')->orderBy('name_en')->get();

        return Inertia::render('Products/Edit', [
            'product' => $productData,
            'categories' => $categories,
        ]);
    }

 public function update(Request $request, Product $product)
{
    $data = $request->validate([
        'category_id' => ['required', 'exists:categories,id'],
        'title_en' => ['required', 'string', 'max:255'],
        'title_bn' => ['required', 'string', 'max:255'],
        'short_desc_en' => ['nullable', 'string'],
        'short_desc_bn' => ['nullable', 'string'],
        'conservation_en' => ['nullable', 'string'],
        'conservation_bn' => ['nullable', 'string'],
        'description_en' => ['nullable', 'string'],
        'description_bn' => ['nullable', 'string'],
        'status' => ['required', 'boolean'],
        'is_free_shipping' => ['boolean'],
        'sort_order' => ['nullable', 'integer'],
        'season' => ['required', 'in:upcoming,ongoing,outofseason'], 
        'feature_image' => ['nullable', 'image', 'max:4096'],
        'hover_image' => ['nullable', 'image', 'max:4096'],

        'features' => ['array'],
        'features.*.feature_en' => ['required_with:features', 'string', 'max:255'],
        'features.*.feature_bn' => ['required_with:features', 'string', 'max:255'],

        'slider_images' => ['array'],
        'slider_images.*' => ['image', 'max:4096'],

        'deleted_slider_images' => ['nullable', 'array'],
        'deleted_slider_images.*' => ['exists:slider_images,id'],
    ]);

    DB::transaction(function () use ($request, $data, $product) {
        $productData = collect($data)->only([
            'category_id',
            'title_en',
            'title_bn',
            'short_desc_en',
            'short_desc_bn',
            'conservation_en',
            'conservation_bn',
            'description_en',
            'description_bn',
            'status',
            'is_free_shipping',
            'sort_order',
            'season', // ADD THIS LINE
        ])->toArray();

        $productData['slug'] = Str::slug($data['title_en']);

        // Rest of the code remains the same...
        if ($request->hasFile('feature_image')) {
            if ($product->feature_image) {
                ImageConversionService::deleteImage($product->feature_image);
            }
            $productData['feature_image'] = $this->storeProductImage($request->file('feature_image'), 'products/feature');
        }

        if ($request->hasFile('hover_image')) {
            if ($product->hover_image) {
                ImageConversionService::deleteImage($product->hover_image);
            }
            $productData['hover_image'] = $this->storeProductImage($request->file('hover_image'), 'products/hover');
        }

        $product->update($productData);

        // Rest of your existing code...
        // Handle features, slider images, etc.
    });

    return to_route('products.index')->with('success', 'Product updated successfully.');
}

    public function deleteSliderImage(SliderImage $sliderImage)
    {
        if ($sliderImage->slider_image) {
            ImageConversionService::deleteImage($sliderImage->slider_image);
        }
        $sliderImage->delete();

        return back()->with('success', 'Slider image deleted successfully.');
    }

    public function destroy(Product $product)
    {
        // Delete images
        if ($product->feature_image) {
            ImageConversionService::deleteImage($product->feature_image);
        }
        if ($product->hover_image) {
            ImageConversionService::deleteImage($product->hover_image);
        }

        foreach ($product->sliderImages as $slider) {
            if ($slider->slider_image) {
                ImageConversionService::deleteImage($slider->slider_image);
            }
        }

        $product->delete();

        return to_route('products.index')->with('success', 'Product deleted successfully.');
    }

    private function storeProductImage(UploadedFile $file, string $directory): string
    {
        return 'storage/' . ImageConversionService::convertToWebP($file, $directory, 85);
    }
}
