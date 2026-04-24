<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\ComboVariantItem;
use App\Models\Product;
use App\Models\Size;
use App\Models\SliderImage;
use App\Models\Variant;
use App\Models\VariantPackaging;
use App\Services\ImageConversionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ComboProductController extends Controller
{
    public function index()
    {
        $comboVariants = Variant::query()
            ->with(['product:id,title_en,title_bn,slug,status,feature_image', 'size:id,amount_en,unit_en,amount_bn,unit_bn'])
            ->whereJsonContains('product_type', 'combo')
            ->latest()
            ->paginate(20);

        return Inertia::render('ComboProduct/Index', [
            'comboVariants' => $comboVariants,
        ]);
    }

    public function create()
    {
        $categories = Category::select('id', 'name_en', 'name_bn')->orderBy('name_en')->get();
        $sizes = Size::select('id', 'amount_en', 'unit_en', 'amount_bn', 'unit_bn')->orderBy('id')->get();

        $availableVariants = Variant::query()
            ->with(['product:id,title_en,title_bn,slug,status', 'size:id,amount_en,unit_en,amount_bn,unit_bn'])
            ->whereHas('product', function ($q) {
                $q->where('status', true);
            })
            ->orderByDesc('id')
            ->get();

        return Inertia::render('ComboProduct/Create', [
            'categories' => $categories,
            'sizes' => $sizes,
            'availableVariants' => $availableVariants,
            'packagingSystems' => $this->packagingSystemOptions(),
        ]);
    }

    public function store(Request $request)
    {
        $packagingSystemValues = $this->packagingSystemValues();
        $validated = $request->validate([
            'category_id' => ['nullable', 'exists:categories,id'],
            'title_en' => ['required', 'string', 'max:255'],
            'title_bn' => ['required', 'string', 'max:255'],
            'short_desc_en' => ['nullable', 'string'],
            'short_desc_bn' => ['nullable', 'string'],
            'conservation_en' => ['nullable', 'string'],
            'conservation_bn' => ['nullable', 'string'],
            'status' => ['required', 'boolean'],
            'feature_image' => ['nullable', 'image', 'max:4096'],
            'slider_images' => ['array'],
            'slider_images.*' => ['image', 'max:4096'],

            'sku' => ['required', 'string', 'max:255'],
            'stock' => ['required', 'integer', 'min:0'],
            'price' => ['required', 'numeric', 'min:0'],
            'discount_price' => ['nullable', 'numeric', 'min:0'],

            'packagings' => ['required', 'array', 'min:1'],
            'packagings.*.packaging_system' => ['required', Rule::in($packagingSystemValues)],
            'packagings.*.max_per_package' => ['required', 'integer', 'min:1', 'max:999999'],
            'packagings.*.shipping_charge_per_package' => ['required', 'numeric', 'min:0'],
            'packagings.*.is_default' => ['nullable', 'boolean'],

            'items' => ['required', 'array', 'min:1'],
            'items.*.included_variant_id' => ['required', 'integer', 'exists:variants,id', 'distinct'],
            'items.*.qty' => ['required', 'integer', 'min:1', 'max:9999'],
        ]);

        $variant = DB::transaction(function () use ($request, $validated) {
            $slug = $this->uniqueProductSlug($validated['title_en']);
            $resolvedCategoryId = $this->resolveComboCategoryId($validated['category_id'] ?? null, $validated['items']);
            $resolvedSizeId = $this->resolveComboSizeId();

            $productData = [
                'category_id' => $resolvedCategoryId,
                'title_en' => $validated['title_en'],
                'title_bn' => $validated['title_bn'],
                'short_desc_en' => $validated['short_desc_en'] ?? null,
                'short_desc_bn' => $validated['short_desc_bn'] ?? null,
                'conservation_en' => $validated['conservation_en'] ?? null,
                'conservation_bn' => $validated['conservation_bn'] ?? null,
                'slug' => $slug,
                'status' => (bool) $validated['status'],
            ];

            if ($request->hasFile('feature_image')) {
                $productData['feature_image'] = ImageConversionService::convertToWebP($request->file('feature_image'), 'products/feature');
            }

            $product = Product::create($productData);

            if ($request->hasFile('slider_images')) {
                foreach ($request->file('slider_images') as $file) {
                    if (! $file) {
                        continue;
                    }
                    SliderImage::create([
                        'product_id' => $product->id,
                        'slider_image' => 'storage/' . ImageConversionService::convertToWebP($file, 'products/slider', 85),
                    ]);
                }
            }

            $packagings = $this->normalizePackagings($validated['packagings']);

            $variant = Variant::create([
                'category_id' => $resolvedCategoryId,
                'product_id' => $product->id,
                'size_id' => $resolvedSizeId,
                'sku' => $validated['sku'],
                'stock' => (int) $validated['stock'],
                'price' => (int) $validated['price'],
                'discount_price' => $validated['discount_price'] !== null ? (int) $validated['discount_price'] : null,
                'product_type' => ['combo'],
            ]);

            $this->syncPackagingsForVariant($variant, $packagings);

            foreach ($validated['items'] as $row) {
                ComboVariantItem::create([
                    'combo_variant_id' => $variant->id,
                    'included_variant_id' => (int) $row['included_variant_id'],
                    'qty' => (int) $row['qty'],
                ]);
            }

            return $variant;
        });

        return Redirect::route('combo-products.index')->with('message', 'Combo package created successfully.');
    }

    public function edit(Variant $variant)
    {
        abort_unless($this->isComboVariant($variant), 404);

        $variant->load([
            'product:id,category_id,title_en,title_bn,short_desc_en,short_desc_bn,conservation_en,conservation_bn,slug,status,feature_image',
            'product.sliderImages:id,product_id,slider_image',
            'size:id,amount_en,unit_en,amount_bn,unit_bn',
            'packagings',
            'comboItems.includedVariant.product:id,title_en,title_bn,slug',
            'comboItems.includedVariant.size:id,amount_en,unit_en,amount_bn,unit_bn',
        ]);

        $categories = Category::select('id', 'name_en', 'name_bn')->orderBy('name_en')->get();
        $sizes = Size::select('id', 'amount_en', 'unit_en', 'amount_bn', 'unit_bn')->orderBy('id')->get();

        $availableVariants = Variant::query()
            ->with(['product:id,title_en,title_bn,slug,status', 'size:id,amount_en,unit_en,amount_bn,unit_bn'])
            ->where('id', '!=', $variant->id)
            ->whereHas('product', function ($q) {
                $q->where('status', true);
            })
            ->orderByDesc('id')
            ->get();

        return Inertia::render('ComboProduct/Edit', [
            'comboVariant' => $variant,
            'availableVariants' => $availableVariants,
            'categories' => $categories,
            'sizes' => $sizes,
            'packagingSystems' => $this->packagingSystemOptions(),
        ]);
    }

    public function update(Request $request, Variant $variant)
    {
        abort_unless($this->isComboVariant($variant), 404);

        $packagingSystemValues = $this->packagingSystemValues();
        $validated = $request->validate([
            'category_id' => ['nullable', 'exists:categories,id'],
            'title_en' => ['required', 'string', 'max:255'],
            'title_bn' => ['required', 'string', 'max:255'],
            'short_desc_en' => ['nullable', 'string'],
            'short_desc_bn' => ['nullable', 'string'],
            'conservation_en' => ['nullable', 'string'],
            'conservation_bn' => ['nullable', 'string'],
            'status' => ['required', 'boolean'],
            'feature_image' => ['nullable', 'image', 'max:4096'],
            'slider_images' => ['array'],
            'slider_images.*' => ['image', 'max:4096'],

            'sku' => ['required', 'string', 'max:255'],
            'stock' => ['required', 'integer', 'min:0'],
            'price' => ['required', 'numeric', 'min:0'],
            'discount_price' => ['nullable', 'numeric', 'min:0'],

            'packagings' => ['required', 'array', 'min:1'],
            'packagings.*.packaging_system' => ['required', Rule::in($packagingSystemValues)],
            'packagings.*.max_per_package' => ['required', 'integer', 'min:1', 'max:999999'],
            'packagings.*.shipping_charge_per_package' => ['required', 'numeric', 'min:0'],
            'packagings.*.is_default' => ['nullable', 'boolean'],

            'items' => ['required', 'array', 'min:1'],
            'items.*.included_variant_id' => ['required', 'integer', 'exists:variants,id', 'distinct'],
            'items.*.qty' => ['required', 'integer', 'min:1', 'max:9999'],
        ]);

        DB::transaction(function () use ($request, $validated, $variant) {
            $product = $variant->product;
            $resolvedCategoryId = $this->resolveComboCategoryId($validated['category_id'] ?? null, $validated['items']);
            $resolvedSizeId = $this->resolveComboSizeId();

            $productData = [
                'category_id' => $resolvedCategoryId,
                'title_en' => $validated['title_en'],
                'title_bn' => $validated['title_bn'],
                'short_desc_en' => $validated['short_desc_en'] ?? null,
                'short_desc_bn' => $validated['short_desc_bn'] ?? null,
                'conservation_en' => $validated['conservation_en'] ?? null,
                'conservation_bn' => $validated['conservation_bn'] ?? null,
                'status' => (bool) $validated['status'],
            ];

            $productData['slug'] = $this->uniqueProductSlug($validated['title_en'], $product->id);

            if ($request->hasFile('feature_image')) {
                if ($product->feature_image) {
                    ImageConversionService::deleteImage($product->feature_image);
                }
                $productData['feature_image'] = ImageConversionService::convertToWebP($request->file('feature_image'), 'products/feature');
            }

            $product->update($productData);

            if ($request->hasFile('slider_images')) {
                foreach ($request->file('slider_images') as $file) {
                    if (! $file) {
                        continue;
                    }
                    SliderImage::create([
                        'product_id' => $product->id,
                        'slider_image' => 'storage/' . ImageConversionService::convertToWebP($file, 'products/slider', 85),
                    ]);
                }
            }

            $variant->update([
                'category_id' => $resolvedCategoryId,
                'size_id' => $resolvedSizeId,
                'sku' => $validated['sku'],
                'stock' => (int) $validated['stock'],
                'price' => (int) $validated['price'],
                'discount_price' => $validated['discount_price'] !== null ? (int) $validated['discount_price'] : null,
                'product_type' => ['combo'],
            ]);

            $packagings = $this->normalizePackagings($validated['packagings']);
            $this->syncPackagingsForVariant($variant, $packagings);

            $items = collect($validated['items'])->map(function ($row) {
                return [
                    'included_variant_id' => (int) $row['included_variant_id'],
                    'qty' => (int) $row['qty'],
                ];
            });

            $existing = ComboVariantItem::where('combo_variant_id', $variant->id)->get()->keyBy('included_variant_id');
            $keepIds = [];

            foreach ($items as $row) {
                $keepIds[] = $row['included_variant_id'];

                $record = $existing->get($row['included_variant_id']);
                if ($record) {
                    $record->update([
                        'qty' => $row['qty'],
                    ]);
                } else {
                    ComboVariantItem::create([
                        'combo_variant_id' => $variant->id,
                        'included_variant_id' => $row['included_variant_id'],
                        'qty' => $row['qty'],
                    ]);
                }
            }

            ComboVariantItem::where('combo_variant_id', $variant->id)
                ->whereNotIn('included_variant_id', $keepIds)
                ->delete();
        });

        return Redirect::route('combo-products.index')->with('message', 'Combo package updated successfully.');
    }

    public function destroy(Variant $variant)
    {
        abort_unless($this->isComboVariant($variant), 404);

        DB::transaction(function () use ($variant) {
            $variant->load('product');

            ComboVariantItem::where('combo_variant_id', $variant->id)->delete();
            VariantPackaging::where('variant_id', $variant->id)->delete();

            $product = $variant->product;
            $variant->delete();

            if ($product) {
                if ($product->feature_image) {
                    ImageConversionService::deleteImage($product->feature_image);
                }
                if ($product->hover_image) {
                    ImageConversionService::deleteImage($product->hover_image);
                }
                $product->delete();
            }
        });

        return Redirect::route('combo-products.index')->with('message', 'Combo package deleted successfully.');
    }

    private function isComboVariant(Variant $variant): bool
    {
        $types = $variant->product_type ?? [];
        return is_array($types) && in_array('combo', $types, true);
    }

    private function uniqueProductSlug(string $titleEn, ?int $ignoreProductId = null): string
    {
        $base = Str::slug($titleEn);
        $slug = $base ?: Str::random(10);

        $counter = 2;
        while (Product::query()
            ->when($ignoreProductId, fn ($q) => $q->where('id', '!=', $ignoreProductId))
            ->where('slug', $slug)
            ->exists()
        ) {
            $slug = "{$base}-{$counter}";
            $counter++;
        }

        return $slug;
    }

    private function normalizePackagings(array $packagings): array
    {
        $packagings = array_values(array_filter($packagings, fn ($p) => is_array($p)));

        if (empty($packagings)) {
            return [];
        }

        $systems = [];
        $defaultCount = 0;
        foreach ($packagings as $p) {
            $system = $p['packaging_system'] ?? null;
            if ($system !== null) {
                $systems[] = $system;
            }
            if (! empty($p['is_default'])) {
                $defaultCount++;
            }
        }

        if (count($systems) !== count(array_unique($systems))) {
            throw ValidationException::withMessages([
                'packagings' => 'Duplicate packaging system is not allowed.',
            ]);
        }

        if ($defaultCount > 1) {
            throw ValidationException::withMessages([
                'packagings' => 'Only one packaging can be default.',
            ]);
        }

        if ($defaultCount === 0) {
            $packagings[0]['is_default'] = true;
        }

        return array_map(function ($p) {
            return [
                'packaging_system' => $p['packaging_system'],
                'max_per_package' => (int) $p['max_per_package'],
                'shipping_charge_per_package' => $p['shipping_charge_per_package'],
                'is_default' => (bool) ($p['is_default'] ?? false),
            ];
        }, $packagings);
    }

    private function syncPackagingsForVariant(Variant $variant, array $packagings): void
    {
        VariantPackaging::where('variant_id', $variant->id)->delete();

        foreach ($packagings as $p) {
            VariantPackaging::create([
                'variant_id' => $variant->id,
                'packaging_system' => $p['packaging_system'],
                'max_per_package' => $p['max_per_package'],
                'shipping_charge_per_package' => $p['shipping_charge_per_package'],
                'is_default' => $p['is_default'],
            ]);
        }
    }

    private function packagingSystemOptions(): array
    {
        return [
            ['value' => 'box', 'label' => 'Box'],
            ['value' => 'bag', 'label' => 'Bag'],
            ['value' => 'cutton', 'label' => 'Cutton'],
            ['value' => 'others', 'label' => 'Others'],
        ];
    }

    private function packagingSystemValues(): array
    {
        return collect($this->packagingSystemOptions())->pluck('value')->all();
    }

    private function resolveComboSizeId(): int
    {
        $size = Size::query()->firstOrCreate(
            [
                'unit_en' => 'Pack',
                'unit_bn' => 'প্যাক',
                'amount_en' => 'Combo',
                'amount_bn' => 'কম্বো',
            ],
            [
                'unit_en' => 'Pack',
                'unit_bn' => 'প্যাক',
                'amount_en' => 'Combo',
                'amount_bn' => 'কম্বো',
            ]
        );

        return (int) $size->id;
    }

    private function resolveComboCategoryId($selectedCategoryId, array $items): ?int
    {
        if (!empty($selectedCategoryId)) {
            return (int) $selectedCategoryId;
        }

        $variantIds = collect($items)
            ->pluck('included_variant_id')
            ->filter()
            ->map(fn ($id) => (int) $id)
            ->unique()
            ->values();

        if ($variantIds->isEmpty()) {
            return null;
        }

        $distinctCategoryIds = Variant::query()
            ->whereIn('id', $variantIds)
            ->pluck('category_id')
            ->filter()
            ->unique()
            ->values();

        if ($distinctCategoryIds->count() === 1) {
            return (int) $distinctCategoryIds->first();
        }

        return $this->getOrCreateComboCategoryId();
    }

    private function getOrCreateComboCategoryId(): int
    {
        $existing = Category::query()
            ->where('slug', 'combo-packages')
            ->orWhere('name_en', 'Combo')
            ->first();

        if ($existing) {
            return (int) $existing->id;
        }

        $slugBase = 'combo-packages';
        $slug = $slugBase;
        $counter = 2;

        while (Category::where('slug', $slug)->exists()) {
            $slug = "{$slugBase}-{$counter}";
            $counter++;
        }

        $category = Category::create([
            'name_en' => 'Combo',
            'name_bn' => 'কম্বো',
            'desc_en' => 'Auto-created category for mixed combo packages.',
            'desc_bn' => 'মিশ্র কম্বো প্যাকেজের জন্য স্বয়ংক্রিয় ক্যাটাগরি।',
            'slug' => $slug,
            'status' => true,
        ]);

        return (int) $category->id;
    }
}
