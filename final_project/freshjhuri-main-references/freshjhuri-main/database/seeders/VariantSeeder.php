<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Size;
use App\Models\Variant;
use Illuminate\Database\Seeder;

class VariantSeeder extends Seeder
{
    public function run(): void
    {
        $sizeIds = Size::pluck('id')->all();

        if (empty($sizeIds)) {
            return;
        }

        Product::query()
            ->with('variants:id,product_id')
            ->select('id', 'category_id')
            ->chunk(200, function ($products) use ($sizeIds) {
                foreach ($products as $product) {
                    if ($product->variants->isNotEmpty()) {
                        continue;
                    }

                    $price = fake()->numberBetween(350, 4500);

                    Variant::create([
                        'category_id' => $product->category_id,
                        'product_id' => $product->id,
                        'size_id' => fake()->randomElement($sizeIds),
                        'sku' => 'SKU-' . $product->id . '-' . fake()->numerify('###'),
                        'stock' => fake()->numberBetween(5, 200),
                        'price' => $price,
                        'discount_price' => fake()->boolean(35)
                            ? max(1, $price - fake()->numberBetween(20, min(800, $price - 1)))
                            : null,
                    ]);
                }
            });
    }
}
