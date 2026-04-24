<?php

namespace App\Http\Controllers\Home;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\Variant;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductPageController extends Controller
{
    // all products on category
    public function allProductsOnCategory($slug)
    {
        $category = $this->resolveCategoryBySlug((string) $slug);
        abort_if(! $category, 404);

        if ($category->slug !== $slug) {
            return redirect()->route('productsoncategory', ['slug' => $category->slug]);
        }

        $with = [
            'category',
            'variants' => function ($query) {
                $query->select('id', 'product_id', 'size_id', 'price', 'discount_price')
                    ->with('size');
            },
        ];

        if (Schema::hasTable('product_statuses')) {
            $with[] = 'productStatus';
        }

        $products = $category->products()
            ->where('status', true)
            ->whereHas('variants')
            ->with($with)
            ->get();

        // Fetch all categories for filters
        $categories = Category::select('id', 'name_en', 'name_bn', 'slug', 'sort_order')
            ->where('status', true)
            ->whereHas('products', function ($query) {
                $query->where('status', true);
            })
            ->orderBy('sort_order')
            ->orderBy('name_en')
            ->get();
        $categories->each(fn(Category $cat) => $this->ensureCategorySlug($cat));

        // Fetch all product statuses for filters (treating as brands/flags)
        $statuses = collect();

        if (Schema::hasTable('product_statuses')) {
            $productStatuses = Product::query()
                ->distinct()
                ->whereNotNull('product_status_id')
                ->pluck('product_status_id')
                ->toArray();

            if (! empty($productStatuses)) {
                $statuses = \App\Models\ProductStatus::whereIn('id', $productStatuses)
                    ->select('id', 'name_en', 'name_bn')
                    ->get();
            }
        }

        return Inertia::render('Home/ProductOnCategoryPage', [
            'products' => $products,
            'currentCategory' => $category,
            'categories' => $categories,
            'productStatuses' => $statuses,
        ]);
    }

    private function resolveCategoryBySlug(string $slug): ?Category
    {
        $normalizedSlug = Str::slug($slug);

        $category = Category::where('slug', $slug)->first();
        if (! $category && $normalizedSlug !== $slug) {
            $category = Category::where('slug', $normalizedSlug)->first();
        }

        if ($category) {
            return $this->ensureCategorySlug($category);
        }

        $fallback = Category::where('status', true)
            ->get(['id', 'name_en', 'name_bn', 'slug', 'status'])
            ->first(function (Category $cat) use ($normalizedSlug) {
                return Str::slug($cat->name_en ?? '') === $normalizedSlug
                    || Str::slug($cat->name_bn ?? '') === $normalizedSlug;
            });

        if (! $fallback) {
            return null;
        }

        if (! $fallback->slug) {
            $fallback->slug = $this->makeUniqueCategorySlug($fallback, $normalizedSlug);
            $fallback->save();
        }

        return $fallback;
    }

    private function ensureCategorySlug(Category $category): Category
    {
        if ($category->slug) {
            return $category;
        }

        $base = Str::slug($category->name_en ?: ($category->name_bn ?: ''));
        if ($base === '') {
            return $category;
        }

        $category->slug = $this->makeUniqueCategorySlug($category, $base);
        $category->save();

        return $category;
    }

    private function makeUniqueCategorySlug(Category $category, string $base): string
    {
        $candidate = $base;
        $suffix = 1;

        while (
            Category::where('slug', $candidate)
            ->where('id', '!=', $category->id)
            ->exists()
        ) {
            $suffix++;
            $candidate = $base . '-' . $suffix;
        }

        return $candidate;
    }

    public function singleProduct($slug)
    {
        $product = Product::where('slug', $slug)
            ->with([
                'category',
                'productFeatures',
                'sliderImages',
                'reviews' => function ($query) {
                    $query->where('is_approved', true)
                        ->with('user:id,name')
                        ->latest();
                },
            ])
            ->firstOrFail();

        $variants = Variant::with(['product', 'size'])
            ->where('product_id', $product->id)
            ->get();

        // Fetch related products (same category, different product)
        // We fetch products and map to their first variant to match the FeaturedProducts component structure
        $relatedProducts = Product::where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('status', true)
            ->with(['variants' => function ($query) {
                $query->with('product'); // Ensure product is loaded on variant
            }])
            ->inRandomOrder()
            ->take(10)
            ->get();

        $relatedVariants = $relatedProducts->map(function ($relatedProduct) {
            return $relatedProduct->variants->first();
        })->filter()->values();

        return Inertia::render('Home/ProductDetailsPage', [
            'product' => $product,
            'variants' => $variants,
            'relatedVariants' => $relatedVariants,
            'reviews' => $product->reviews,
        ]);
    }
}
