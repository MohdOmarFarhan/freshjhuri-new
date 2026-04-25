<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductAttribute;
use App\Models\ProductFeature;
use App\Models\ProductNutritionFact;
use App\Models\ProductRelation;
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
        $products = Product::select('id', 'title_en')->orderBy('title_en')->get();

        return Inertia::render('Products/Create', [
            'categories' => $categories,
            'products' => $products,
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
            'badge_en' => ['nullable', 'string', 'max:255'],
            'badge_bn' => ['nullable', 'string', 'max:255'],
            'description_en' => ['nullable', 'string'],
            'description_bn' => ['nullable', 'string'],
            'origin_story_en' => ['nullable', 'string'],
            'origin_story_bn' => ['nullable', 'string'],
            'conservation_en' => ['nullable', 'string'],
            'conservation_bn' => ['nullable', 'string'],
            'status' => ['required', 'boolean'],
            'is_free_shipping' => ['boolean'],
            'is_organic' => ['boolean'],
            'is_sugar_free' => ['boolean'],
            'is_pre_order' => ['boolean'],
            'is_top_selling' => ['boolean'],
            'sort_order' => ['nullable', 'integer'],
            'season' => ['required', 'in:upcoming,ongoing,outofseason'],
            'feature_image' => ['nullable', 'image', 'max:4096'],
            'hover_image' => ['nullable', 'image', 'max:4096'],
            'video_url' => ['nullable', 'url', 'max:2048'],

            'features' => ['array'],
            'features.*.feature_en' => ['required_with:features', 'string', 'max:255'],
            'features.*.feature_bn' => ['required_with:features', 'string', 'max:255'],

            'slider_images' => ['array'],
            'slider_images.*' => ['image', 'max:4096'],

            'attributes' => ['array'],
            'attributes.*.key' => ['required_with:attributes', 'string', 'max:255'],
            'attributes.*.label_en' => ['nullable', 'string', 'max:255'],
            'attributes.*.label_bn' => ['nullable', 'string', 'max:255'],
            'attributes.*.value_en' => ['required_with:attributes', 'string'],
            'attributes.*.value_bn' => ['nullable', 'string'],
            'attributes.*.sort_order' => ['nullable', 'integer'],

            'nutrition_facts' => ['array'],
            'nutrition_facts.*.name_en' => ['required_with:nutrition_facts', 'string', 'max:255'],
            'nutrition_facts.*.name_bn' => ['nullable', 'string', 'max:255'],
            'nutrition_facts.*.value' => ['required_with:nutrition_facts', 'string', 'max:255'],
            'nutrition_facts.*.unit' => ['nullable', 'string', 'max:50'],
            'nutrition_facts.*.per_quantity' => ['nullable', 'numeric'],
            'nutrition_facts.*.per_unit' => ['nullable', 'string', 'max:20'],
            'nutrition_facts.*.sort_order' => ['nullable', 'integer'],

            'fbt_relations' => ['array'],
            'fbt_relations.*.related_product_id' => ['required_with:fbt_relations', 'exists:products,id'],
            'fbt_relations.*.discount_percent' => ['nullable', 'numeric', 'min:0', 'max:99.99'],
            'fbt_relations.*.sort_order' => ['nullable', 'integer'],
        ]);

        DB::transaction(function () use ($request, $data) {
            $productData = collect($data)->only([
                'category_id',
                'title_en',
                'title_bn',
                'short_desc_en',
                'short_desc_bn',
                'badge_en',
                'badge_bn',
                'description_en',
                'description_bn',
                'origin_story_en',
                'origin_story_bn',
                'conservation_en',
                'conservation_bn',
                'status',
                'is_free_shipping',
                'is_organic',
                'is_sugar_free',
                'is_pre_order',
                'is_top_selling',
                'sort_order',
                'season',
                'video_url',
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

            foreach ($data['attributes'] ?? [] as $index => $item) {
                if (!($item['key'] ?? null) || !($item['value_en'] ?? null)) {
                    continue;
                }
                ProductAttribute::create([
                    'product_id' => $product->id,
                    'key' => $item['key'],
                    'label_en' => $item['label_en'] ?? null,
                    'label_bn' => $item['label_bn'] ?? null,
                    'value_en' => $item['value_en'],
                    'value_bn' => $item['value_bn'] ?? null,
                    'sort_order' => (int) ($item['sort_order'] ?? ($index + 1)),
                ]);
            }

            foreach ($data['nutrition_facts'] ?? [] as $index => $item) {
                if (!($item['name_en'] ?? null) || !($item['value'] ?? null)) {
                    continue;
                }
                ProductNutritionFact::create([
                    'product_id' => $product->id,
                    'name_en' => $item['name_en'],
                    'name_bn' => $item['name_bn'] ?? null,
                    'value' => $item['value'],
                    'unit' => $item['unit'] ?? null,
                    'per_quantity' => $item['per_quantity'] ?? 100,
                    'per_unit' => $item['per_unit'] ?? 'g',
                    'sort_order' => (int) ($item['sort_order'] ?? ($index + 1)),
                ]);
            }

            foreach ($data['fbt_relations'] ?? [] as $index => $item) {
                $relatedId = $item['related_product_id'] ?? null;
                if (! $relatedId) {
                    continue;
                }
                if ((int) $relatedId === (int) $product->id) {
                    continue;
                }
                ProductRelation::create([
                    'product_id' => $product->id,
                    'related_product_id' => $relatedId,
                    'type' => 'frequently_bought_together',
                    'discount_percent' => $item['discount_percent'] ?? null,
                    'sort_order' => (int) ($item['sort_order'] ?? ($index + 1)),
                ]);
            }
        });

        return to_route('products.index')->with('success', 'Product created successfully.');
    }

    public function edit(Product $product)
    {
        $product->load([
            'productFeatures:id,product_id,feature_en,feature_bn',
            'sliderImages:id,product_id,slider_image',
            'attributes:id,product_id,key,label_en,label_bn,value_en,value_bn,sort_order',
            'nutritionFacts:id,product_id,name_en,name_bn,value,unit,per_quantity,per_unit,sort_order',
            'relations' => function ($query) {
                $query->where('type', 'frequently_bought_together')->orderBy('sort_order')->orderByDesc('id');
            },
        ]);

        $productData = [
            'id' => $product->id,
            'category_id' => $product->category_id,
            'title_en' => $product->title_en,
            'title_bn' => $product->title_bn,
            'short_desc_en' => $product->short_desc_en,
            'short_desc_bn' => $product->short_desc_bn,
            'badge_en' => $product->badge_en,
            'badge_bn' => $product->badge_bn,
            'conservation_en' => $product->conservation_en,
            'conservation_bn' => $product->conservation_bn,
            'description_en' => $product->description_en,
            'description_bn' => $product->description_bn,
            'origin_story_en' => $product->origin_story_en,
            'origin_story_bn' => $product->origin_story_bn,
            'status' => $product->status,
            'is_free_shipping' => $product->is_free_shipping,
            'is_organic' => $product->is_organic,
            'is_sugar_free' => $product->is_sugar_free,
            'is_pre_order' => $product->is_pre_order,
            'is_top_selling' => $product->is_top_selling,
            'sort_order' => $product->sort_order,
            'season' => $product->season,
            'feature_image' => $product->feature_image,
            'hover_image' => $product->hover_image,
            'video_url' => $product->video_url,
            'product_features' => $product->productFeatures,
            'slider_images' => $product->sliderImages,
            'attributes' => $product->attributes,
            'nutrition_facts' => $product->nutritionFacts,
            'fbt_relations' => $product->relations,
        ];

        $categories = Category::select('id', 'name_en', 'name_bn')->orderBy('name_en')->get();
        $products = Product::select('id', 'title_en')->orderBy('title_en')->get();

        return Inertia::render('Products/Edit', [
            'product' => $productData,
            'categories' => $categories,
            'products' => $products,
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
            'badge_en' => ['nullable', 'string', 'max:255'],
            'badge_bn' => ['nullable', 'string', 'max:255'],
            'conservation_en' => ['nullable', 'string'],
            'conservation_bn' => ['nullable', 'string'],
            'description_en' => ['nullable', 'string'],
            'description_bn' => ['nullable', 'string'],
            'origin_story_en' => ['nullable', 'string'],
            'origin_story_bn' => ['nullable', 'string'],
            'video_url' => ['nullable', 'url', 'max:2048'],
            'status' => ['required', 'boolean'],
            'is_free_shipping' => ['boolean'],
            'is_organic' => ['boolean'],
            'is_sugar_free' => ['boolean'],
            'is_pre_order' => ['boolean'],
            'is_top_selling' => ['boolean'],
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

            'attributes' => ['array'],
            'attributes.*.key' => ['required_with:attributes', 'string', 'max:255'],
            'attributes.*.label_en' => ['nullable', 'string', 'max:255'],
            'attributes.*.label_bn' => ['nullable', 'string', 'max:255'],
            'attributes.*.value_en' => ['required_with:attributes', 'string'],
            'attributes.*.value_bn' => ['nullable', 'string'],
            'attributes.*.sort_order' => ['nullable', 'integer'],

            'nutrition_facts' => ['array'],
            'nutrition_facts.*.name_en' => ['required_with:nutrition_facts', 'string', 'max:255'],
            'nutrition_facts.*.name_bn' => ['nullable', 'string', 'max:255'],
            'nutrition_facts.*.value' => ['required_with:nutrition_facts', 'string', 'max:255'],
            'nutrition_facts.*.unit' => ['nullable', 'string', 'max:50'],
            'nutrition_facts.*.per_quantity' => ['nullable', 'numeric'],
            'nutrition_facts.*.per_unit' => ['nullable', 'string', 'max:20'],
            'nutrition_facts.*.sort_order' => ['nullable', 'integer'],

            'fbt_relations' => ['array'],
            'fbt_relations.*.related_product_id' => ['required_with:fbt_relations', 'exists:products,id'],
            'fbt_relations.*.discount_percent' => ['nullable', 'numeric', 'min:0', 'max:99.99'],
            'fbt_relations.*.sort_order' => ['nullable', 'integer'],
        ]);

        DB::transaction(function () use ($request, $data, $product) {
            $productData = collect($data)->only([
                'category_id',
                'title_en',
                'title_bn',
                'short_desc_en',
                'short_desc_bn',
                'badge_en',
                'badge_bn',
                'conservation_en',
                'conservation_bn',
                'description_en',
                'description_bn',
                'origin_story_en',
                'origin_story_bn',
                'video_url',
                'status',
                'is_free_shipping',
                'is_organic',
                'is_sugar_free',
                'is_pre_order',
                'is_top_selling',
                'sort_order',
                'season',
            ])->toArray();

            $productData['slug'] = Str::slug($data['title_en']);

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

            ProductFeature::where('product_id', $product->id)->delete();
            foreach ($data['features'] ?? [] as $item) {
                ProductFeature::create([
                    'product_id' => $product->id,
                    'feature_en' => $item['feature_en'],
                    'feature_bn' => $item['feature_bn'],
                ]);
            }

            $deletedSlider = $data['deleted_slider_images'] ?? [];
            if (! empty($deletedSlider)) {
                $toDelete = SliderImage::query()
                    ->where('product_id', $product->id)
                    ->whereIn('id', $deletedSlider)
                    ->get();
                foreach ($toDelete as $slider) {
                    if ($slider->slider_image) {
                        ImageConversionService::deleteImage($slider->slider_image);
                    }
                    $slider->delete();
                }
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

            ProductAttribute::where('product_id', $product->id)->delete();
            foreach ($data['attributes'] ?? [] as $index => $item) {
                if (!($item['key'] ?? null) || !($item['value_en'] ?? null)) {
                    continue;
                }
                ProductAttribute::create([
                    'product_id' => $product->id,
                    'key' => $item['key'],
                    'label_en' => $item['label_en'] ?? null,
                    'label_bn' => $item['label_bn'] ?? null,
                    'value_en' => $item['value_en'],
                    'value_bn' => $item['value_bn'] ?? null,
                    'sort_order' => (int) ($item['sort_order'] ?? ($index + 1)),
                ]);
            }

            ProductNutritionFact::where('product_id', $product->id)->delete();
            foreach ($data['nutrition_facts'] ?? [] as $index => $item) {
                if (!($item['name_en'] ?? null) || !($item['value'] ?? null)) {
                    continue;
                }
                ProductNutritionFact::create([
                    'product_id' => $product->id,
                    'name_en' => $item['name_en'],
                    'name_bn' => $item['name_bn'] ?? null,
                    'value' => $item['value'],
                    'unit' => $item['unit'] ?? null,
                    'per_quantity' => $item['per_quantity'] ?? 100,
                    'per_unit' => $item['per_unit'] ?? 'g',
                    'sort_order' => (int) ($item['sort_order'] ?? ($index + 1)),
                ]);
            }

            ProductRelation::where('product_id', $product->id)
                ->where('type', 'frequently_bought_together')
                ->delete();
            foreach ($data['fbt_relations'] ?? [] as $index => $item) {
                $relatedId = $item['related_product_id'] ?? null;
                if (! $relatedId) {
                    continue;
                }
                if ((int) $relatedId === (int) $product->id) {
                    continue;
                }
                ProductRelation::create([
                    'product_id' => $product->id,
                    'related_product_id' => $relatedId,
                    'type' => 'frequently_bought_together',
                    'discount_percent' => $item['discount_percent'] ?? null,
                    'sort_order' => (int) ($item['sort_order'] ?? ($index + 1)),
                ]);
            }
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
