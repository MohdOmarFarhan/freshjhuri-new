<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\Size;
use App\Models\Variant;
use App\Models\VariantPackaging;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class VariantController extends Controller
{
    public function index()
    {
        $variants = Variant::with(['category', 'product', 'size', 'packagings'])->latest()->get();

        return Inertia::render('Variant/Index', [
            'variants' => $variants,
        ]);
    }

    public function create()
    {
        $categories = Category::latest()->get(['id', 'name_en']);
        $products = Product::latest()->get(['id', 'title_en', 'category_id']);
        $sizes = Size::latest()->get(['id', 'unit_en', 'unit_bn', 'amount_en', 'amount_bn']);

        $productTypes = config('product_types');
        return Inertia::render('Variant/Create', [
            'categories' => $categories,
            'products' => $products,
            'sizes' => $sizes,
            'product_types' => $productTypes,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'product_id' => ['required', 'exists:products,id'],
            'sku' => ['required', 'string', 'max:255'],
            'variants' => ['required', 'array', 'min:1'],
            'variants.*.size_id' => ['required', 'exists:sizes,id', 'distinct'],
            'variants.*.stock' => ['required', 'integer', 'min:0'],
            'variants.*.price' => ['required', 'integer', 'min:0'],
            'variants.*.discount_price' => ['nullable', 'integer', 'min:0'],
            'variants.*.product_type' => ['nullable', 'array'],
            'variants.*.packagings' => ['nullable', 'array'],
            'variants.*.packagings.*.packaging_system' => ['required_with:variants.*.packagings', 'in:box,bag,cutton,others'],
            'variants.*.packagings.*.max_per_package' => ['required_with:variants.*.packagings', 'integer', 'min:1'],
            'variants.*.packagings.*.shipping_charge_per_package' => ['required_with:variants.*.packagings', 'numeric', 'min:0'],
            'variants.*.packagings.*.is_default' => ['nullable', 'boolean'],
        ]);

        $productBelongsToCategory = Product::where('id', $validated['product_id'])
            ->where('category_id', $validated['category_id'])
            ->exists();

        if (! $productBelongsToCategory) {
            return back()->withErrors([
                'product_id' => 'Selected product does not belong to the selected category.',
            ])->withInput();
        }

        foreach ($validated['variants'] as $index => $variantData) {
            $createdVariant = Variant::create([
                'category_id' => $validated['category_id'],
                'product_id' => $validated['product_id'],
                'size_id' => $variantData['size_id'],
                'sku' => $validated['sku'],
                'stock' => $variantData['stock'],
                'price' => $variantData['price'],
                'discount_price' => $variantData['discount_price'] ?? null,
                'product_type' => $variantData['product_type'] ?? [],
            ]);

            try {
                $packagings = $this->normalizePackagings($variantData['packagings'] ?? []);
            } catch (ValidationException $e) {
                $message = $e->errors()['packagings'][0] ?? 'Invalid packagings.';
                throw ValidationException::withMessages([
                    "variants.{$index}.packagings" => $message,
                ]);
            }

            $this->syncPackagingsForVariant($createdVariant, $packagings);
        }

        return Redirect::route('variants.index')->with('message', 'Variant created successfully.');
    }

    public function edit(Variant $variant)
    {
        $categories = Category::latest()->get(['id', 'name_en']);
        $products = Product::latest()->get(['id', 'title_en', 'category_id']);
        $sizes = Size::latest()->get(['id', 'unit_en', 'unit_bn', 'amount_en', 'amount_bn']);

        $groupVariants = Variant::where('product_id', $variant->product_id)
            ->where('sku', $variant->sku)
            ->orderBy('id')
            ->get([
                'id',
                'category_id',
                'product_id',
                'size_id',
                'sku',
                'stock',
                'price',
                'discount_price',
                'product_type',
            ]);
        $groupVariants->load('packagings');

        $productTypes = config('product_types');
        return Inertia::render('Variant/Edit', [
            'variant' => $variant->load(['category', 'product', 'size']),
            'variants' => $groupVariants,
            'categories' => $categories,
            'products' => $products,
            'sizes' => $sizes,
            'product_types' => $productTypes,
        ]);
    }

    public function update(Request $request, Variant $variant)
    {
        $validated = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'product_id' => ['required', 'exists:products,id'],
            'sku' => ['required', 'string', 'max:255'],
            'variants' => ['required', 'array', 'min:1'],
            'variants.*.id' => ['nullable', 'integer', 'exists:variants,id'],
            'variants.*.size_id' => ['required', 'exists:sizes,id', 'distinct'],
            'variants.*.stock' => ['required', 'integer', 'min:0'],
            'variants.*.price' => ['required', 'integer', 'min:0'],
            'variants.*.discount_price' => ['nullable', 'integer', 'min:0'],
            'variants.*.product_type' => ['nullable', 'array'],
            'variants.*.packagings' => ['nullable', 'array'],
            'variants.*.packagings.*.packaging_system' => ['required_with:variants.*.packagings', 'in:box,bag,cutton,others'],
            'variants.*.packagings.*.max_per_package' => ['required_with:variants.*.packagings', 'integer', 'min:1'],
            'variants.*.packagings.*.shipping_charge_per_package' => ['required_with:variants.*.packagings', 'numeric', 'min:0'],
            'variants.*.packagings.*.is_default' => ['nullable', 'boolean'],
        ]);

        $productBelongsToCategory = Product::where('id', $validated['product_id'])
            ->where('category_id', $validated['category_id'])
            ->exists();

        if (! $productBelongsToCategory) {
            return back()->withErrors([
                'product_id' => 'Selected product does not belong to the selected category.',
            ])->withInput();
        }

        $existingVariants = Variant::where('product_id', $variant->product_id)
            ->where('sku', $variant->sku)
            ->get()
            ->keyBy('id');

        foreach ($validated['variants'] as $index => $variantData) {
            try {
                $packagings = $this->normalizePackagings($variantData['packagings'] ?? []);
            } catch (ValidationException $e) {
                $message = $e->errors()['packagings'][0] ?? 'Invalid packagings.';
                throw ValidationException::withMessages([
                    "variants.{$index}.packagings" => $message,
                ]);
            }

            if (! empty($variantData['id']) && $existingVariants->has($variantData['id'])) {
                $existingVariant = $existingVariants->get($variantData['id']);

                $existingVariant->update([
                    'category_id' => $validated['category_id'],
                    'product_id' => $validated['product_id'],
                    'size_id' => $variantData['size_id'],
                    'sku' => $validated['sku'],
                    'stock' => $variantData['stock'],
                    'price' => $variantData['price'],
                    'discount_price' => $variantData['discount_price'] ?? null,
                    'product_type' => $variantData['product_type'] ?? [],
                ]);

                $this->syncPackagingsForVariant($existingVariant, $packagings);
            } else {
                $createdVariant = Variant::create([
                    'category_id' => $validated['category_id'],
                    'product_id' => $validated['product_id'],
                    'size_id' => $variantData['size_id'],
                    'sku' => $validated['sku'],
                    'stock' => $variantData['stock'],
                    'price' => $variantData['price'],
                    'discount_price' => $variantData['discount_price'] ?? null,
                    'product_type' => $variantData['product_type'] ?? [],
                ]);

                $this->syncPackagingsForVariant($createdVariant, $packagings);
            }
        }

        return Redirect::route('variants.index')->with('message', 'Variant updated successfully.');
    }

    private function normalizePackagings(array $packagings): array
    {
        $packagings = array_values(array_filter($packagings, fn($p) => is_array($p)));

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

    public function delete(Variant $variant)
    {
        $variant->delete();

        return Redirect::route('variants.index')->with('message', 'Variant deleted successfully.');
    }

    public function deleteGroup(Variant $variant)
    {
        Variant::where('product_id', $variant->product_id)
            ->where('sku', $variant->sku)
            ->delete();

        return Redirect::route('variants.index')->with('message', 'Variant group deleted successfully.');
    }
}
