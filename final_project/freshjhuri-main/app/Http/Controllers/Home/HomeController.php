<?php

namespace App\Http\Controllers\Home;

use App\Http\Controllers\Controller;
use App\Models\Bannar;
use App\Models\Category;
use App\Models\Product;
use App\Models\Service;
use App\Models\Variant;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function homePage()
    {
            $bannars = Bannar::with('category:id,slug,name_en,name_bn')
            ->whereHas('category', function ($q) {
                $q->where('status', true)
                    ->whereHas('products');
            })
            ->latest()
            ->get()
            ->map(function ($bannar) {
                if ($bannar->category) {
                    $bannar->category_slug = $bannar->category->slug;
                }
                return $bannar;
            });
        // dd($bannars);

        $categories = Category::query()
            ->where('status', true)
            ->where('is_featured', true)
            ->whereHas('products')
            ->orderBy('sort_order')
            ->orderByDesc('id')
            ->get();

        $services = Service::query()
            ->where('status', true)
            ->orderBy('sort_order')
            ->get();

        // Featured products - sorted by product.sort_order
        $products = Product::with(['variants' => function ($q) {
            $q->whereJsonContains('product_type', 'featured');
        }, 'variants.size'])
            ->whereHas('variants', function ($q) {
                $q->whereJsonContains('product_type', 'featured');
            })
            ->where('status', true)
            ->orderBy('sort_order')
            ->orderByDesc('id')
            ->take(20)
            ->get();

        $featureProducts = $products->map(function ($product) {
            $variant = $product->variants->first();
            if ($variant) {
                $variant->setRelation('product', $product);
                return $variant;
            }
            return null;
        })->filter()->values();

        // Best selling products - sorted by product.sort_order
        $bestsellings = Product::with(['variants' => function ($q) {
            $q->whereJsonContains('product_type', 'best-selling');
        }, 'variants.size'])
            ->whereHas('variants', function ($q) {
                $q->whereJsonContains('product_type', 'best-selling');
            })
            ->where('status', true)
            ->orderBy('sort_order')
            ->orderByDesc('id')
            ->take(20)
            ->get();

        $bestSellingProducts = $bestsellings->map(function ($product) {
            $variant = $product->variants->first();
            if ($variant) {
                $variant->setRelation('product', $product);
                return $variant;
            }
            return null;
        })->filter()->values();

        $serviceVideos = \App\Models\ServiceVideo::where('status', true)->latest()->get();

        $brandMarquees = \App\Models\BrandMarquee::where('status', true)
            ->orderBy('sort_order')
            ->get();

        // Combo products - sort by product.sort_order instead of variant.sort_order
        $comboProducts = Variant::query()
            ->with([
                'product',
                'size',
                'comboItems.includedVariant.product',
                'comboItems.includedVariant.size',
            ])
            ->whereJsonContains('product_type', 'combo')
            ->whereHas('product', function ($q) {
                $q->where('status', true);
            })
            ->join('products', 'variants.product_id', '=', 'products.id')  // Join with products table
            ->orderBy('products.sort_order', 'asc')  // Sort by product.sort_order
            ->orderBy('variants.id', 'desc')  // Secondary sort by variant ID
            ->select('variants.*')  // Select only variant columns to avoid conflicts
            ->take(20)
            ->get();

        $homepageSectionsData = \App\Models\HomepageSection::where('status', true)
            ->orderBy('sort_order')
            ->get();

        $resolvedSections = $homepageSectionsData->map(function ($section) {
            $sectionArray = $section->toArray();
            
            if ($section->type === 'category' && $section->category_id) {
                $products = Product::with(['variants.size'])
                    ->whereHas('variants')
                    ->where('category_id', $section->category_id)
                    ->where('status', true)
                    ->orderBy('sort_order')
                    ->orderByDesc('id')
                    ->take(20)
                    ->get();
            } elseif ($section->type === 'combo') {
                $comboVariants = Variant::query()
                    ->with([
                        'product',
                        'size',
                        'comboItems.includedVariant.product',
                        'comboItems.includedVariant.size',
                    ])
                    ->whereJsonContains('product_type', 'combo')
                    ->whereHas('product', function ($q) {
                        $q->where('status', true);
                    })
                    ->join('products', 'variants.product_id', '=', 'products.id')
                    ->orderBy('products.sort_order', 'asc')
                    ->orderBy('variants.id', 'desc')
                    ->select('variants.*')
                    ->take(20)
                    ->get();
                    
                $sectionArray['products'] = $comboVariants;
                return $sectionArray;
            } elseif ($section->type === 'new-arrival') {
                $products = Product::with(['variants.size'])
                    ->whereHas('variants')
                    ->where('status', true)
                    ->latest()
                    ->take(20)
                    ->get();
            } else {
                // featured, best-selling
                $products = Product::with(['variants' => function ($q) use ($section) {
                    $q->whereJsonContains('product_type', $section->type);
                }, 'variants.size'])
                    ->whereHas('variants', function ($q) use ($section) {
                        $q->whereJsonContains('product_type', $section->type);
                    })
                    ->where('status', true)
                    ->orderBy('sort_order')
                    ->orderByDesc('id')
                    ->take(20)
                    ->get();
            }

            $sectionProducts = $products->map(function ($product) use ($section) {
                // For non-combo, we usually return the specific variant
                $variant = $section->type === 'category' || $section->type === 'new-arrival' 
                    ? $product->variants->first() 
                    : $product->variants->first();
                    
                if ($variant) {
                    $variant->setRelation('product', $product);
                    return $variant;
                }
                return null;
            })->filter()->values();

            $sectionArray['products'] = $sectionProducts;
            return $sectionArray;
        });

        // We can keep the old variables just in case they are needed by other components,
        // but we'll add 'homepageSections' to pass the dynamic ones.
        return Inertia::render('HomePage', [
            'bannars' => $bannars,
            'categories' => $categories,
            'services' => $services,
            'featureProducts' => $featureProducts,
            'bestSellingProducts' => $bestSellingProducts,
            'serviceVideos' => $serviceVideos,
            'comboProducts' => $comboProducts,
            'brandMarquees' => $brandMarquees,
            'homepageSections' => $resolvedSections,
        ]);
    }
}