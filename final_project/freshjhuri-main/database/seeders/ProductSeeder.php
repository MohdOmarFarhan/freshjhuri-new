<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $categories = Category::orderBy('id')->get();

        if ($categories->isEmpty()) {
            return;
        }

        $minProducts = max((int) env('SEED_TOTAL_PRODUCTS_MIN', 35), 1);
        $maxProducts = max((int) env('SEED_TOTAL_PRODUCTS_MAX', 40), $minProducts);

        $configuredTotal = env('SEED_TOTAL_PRODUCTS');
        $totalProducts = $configuredTotal !== null
            ? (int) $configuredTotal
            : random_int($minProducts, $maxProducts);

        $totalProducts = max($totalProducts, $categories->count());

        $basePerCategory = intdiv($totalProducts, $categories->count());
        $remainder = $totalProducts % $categories->count();

        foreach ($categories as $index => $category) {
            $productsForThisCategory = $basePerCategory + ($index < $remainder ? 1 : 0);
            $categorySlugBase = Str::slug($category->slug ?: $category->name_en ?: 'category');
            $keptSlugs = [];

            for ($i = 1; $i <= $productsForThisCategory; $i++) {
                $titleEn = trim(($category->name_en ?: 'Category') . ' Product ' . $i);
                $slug = $categorySlugBase . '-product-' . $i;
                $keptSlugs[] = $slug;

                Product::updateOrCreate(
                    ['slug' => $slug],
                    [
                        'category_id' => $category->id,
                        'title_en' => $titleEn,
                        'title_bn' => $titleEn,
                        'short_desc_en' => fake()->sentence(10),
                        'short_desc_bn' => fake()->sentence(10),
                        'description_en' => fake()->paragraphs(2, true),
                        'description_bn' => fake()->paragraphs(2, true),
                        'feature_image' => null,
                        'hover_image' => null,
                        'status' => true,
                        'is_free_shipping' => fake()->boolean(30),
                    ]
                );
            }

            Product::where('category_id', $category->id)
                ->where('slug', 'like', $categorySlugBase . '-product-%')
                ->whereNotIn('slug', $keptSlugs)
                ->delete();
        }
    }
}
