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
        $sizes = Size::query()
            ->select('id', 'amount_en', 'unit_en')
            ->get()
            ->keyBy(fn (Size $size) => $this->sizeKey($size->amount_en, $size->unit_en));

        if ($sizes->isEmpty()) {
            return;
        }

        $products = Product::query()
            ->select('id', 'category_id', 'slug')
            ->get()
            ->keyBy('slug');

        foreach ($this->variantCatalog() as $productSlug => $variants) {
            $product = $products->get($productSlug);

            if (! $product) {
                continue;
            }

            foreach ($variants as $variantData) {
                $size = $sizes->get($this->sizeKey($variantData['amount'], $variantData['unit']));

                if (! $size) {
                    continue;
                }

                Variant::create([
                    'category_id' => $product->category_id,
                    'product_id' => $product->id,
                    'size_id' => $size->id,
                    'sku' => $variantData['sku'],
                    'stock' => $variantData['stock'],
                    'price' => $variantData['price'],
                    'discount_price' => $variantData['discount_price'],
                    'product_type' => $variantData['product_type'],
                ]);
            }
        }
    }

    private function sizeKey(string $amount, string $unit): string
    {
        return strtolower(trim($amount) . '-' . trim($unit));
    }

    private function variantCatalog(): array
    {
        return [
            'litchi-flower-honey' => [
                ['amount' => '500', 'unit' => 'gm', 'sku' => 'HON-LIT-500', 'stock' => 72, 'price' => 460, 'discount_price' => 420, 'product_type' => ['featured', 'best-selling']],
                ['amount' => '1', 'unit' => 'kg', 'sku' => 'HON-LIT-1KG', 'stock' => 38, 'price' => 860, 'discount_price' => 790, 'product_type' => ['featured']],
            ],
            'sundarban-wild-honey' => [
                ['amount' => '500', 'unit' => 'gm', 'sku' => 'HON-SUN-500', 'stock' => 34, 'price' => 780, 'discount_price' => 720, 'product_type' => ['best-selling']],
                ['amount' => '1', 'unit' => 'kg', 'sku' => 'HON-SUN-1KG', 'stock' => 18, 'price' => 1490, 'discount_price' => 1390, 'product_type' => ['featured', 'best-selling']],
            ],
            'black-seed-honey' => [
                ['amount' => '500', 'unit' => 'gm', 'sku' => 'HON-BLS-500', 'stock' => 26, 'price' => 1180, 'discount_price' => 1090, 'product_type' => ['featured']],
                ['amount' => '1', 'unit' => 'kg', 'sku' => 'HON-BLS-1KG', 'stock' => 12, 'price' => 2190, 'discount_price' => 2050, 'product_type' => ['featured', 'new-arrival']],
            ],
            'gopalbhog-mango' => [
                ['amount' => '2', 'unit' => 'kg', 'sku' => 'FRT-GOP-2KG', 'stock' => 45, 'price' => 260, 'discount_price' => 230, 'product_type' => ['featured', 'new-arrival']],
                ['amount' => '5', 'unit' => 'kg', 'sku' => 'FRT-GOP-5KG', 'stock' => 24, 'price' => 620, 'discount_price' => 560, 'product_type' => ['new-arrival']],
            ],
            'fazli-mango' => [
                ['amount' => '2', 'unit' => 'kg', 'sku' => 'FRT-FAZ-2KG', 'stock' => 40, 'price' => 220, 'discount_price' => 199, 'product_type' => ['featured']],
                ['amount' => '5', 'unit' => 'kg', 'sku' => 'FRT-FAZ-5KG', 'stock' => 20, 'price' => 540, 'discount_price' => 495, 'product_type' => []],
            ],
            'bombai-litchi' => [
                ['amount' => '1', 'unit' => 'box', 'sku' => 'FRT-LIT-BOX', 'stock' => 28, 'price' => 640, 'discount_price' => 590, 'product_type' => ['new-arrival']],
                ['amount' => '1', 'unit' => 'piece', 'sku' => 'FRT-LIT-SMP', 'stock' => 80, 'price' => 95, 'discount_price' => null, 'product_type' => ['new-arrival']],
            ],
            'ajwa-dates' => [
                ['amount' => '500', 'unit' => 'gm', 'sku' => 'DAT-AJW-500', 'stock' => 52, 'price' => 890, 'discount_price' => 830, 'product_type' => ['featured', 'best-selling']],
                ['amount' => '1', 'unit' => 'kg', 'sku' => 'DAT-AJW-1KG', 'stock' => 22, 'price' => 1690, 'discount_price' => 1590, 'product_type' => ['best-selling']],
            ],
            'medjool-dates' => [
                ['amount' => '500', 'unit' => 'gm', 'sku' => 'DAT-MED-500', 'stock' => 30, 'price' => 1180, 'discount_price' => 1090, 'product_type' => ['featured']],
                ['amount' => '1', 'unit' => 'kg', 'sku' => 'DAT-MED-1KG', 'stock' => 14, 'price' => 2280, 'discount_price' => 2150, 'product_type' => ['featured']],
            ],
            'sukkari-dates' => [
                ['amount' => '500', 'unit' => 'gm', 'sku' => 'DAT-SUK-500', 'stock' => 42, 'price' => 760, 'discount_price' => 710, 'product_type' => ['new-arrival']],
                ['amount' => '1', 'unit' => 'kg', 'sku' => 'DAT-SUK-1KG', 'stock' => 20, 'price' => 1420, 'discount_price' => 1340, 'product_type' => ['new-arrival']],
            ],
            'deshi-gawa-ghee' => [
                ['amount' => '500', 'unit' => 'gm', 'sku' => 'CKG-GHE-500', 'stock' => 36, 'price' => 980, 'discount_price' => 920, 'product_type' => ['featured', 'best-selling']],
                ['amount' => '1', 'unit' => 'kg', 'sku' => 'CKG-GHE-1KG', 'stock' => 16, 'price' => 1840, 'discount_price' => 1750, 'product_type' => ['best-selling']],
            ],
            'cold-pressed-mustard-oil' => [
                ['amount' => '500', 'unit' => 'ml', 'sku' => 'CKG-MUS-500', 'stock' => 54, 'price' => 260, 'discount_price' => 235, 'product_type' => []],
                ['amount' => '1', 'unit' => 'liter', 'sku' => 'CKG-MUS-1LT', 'stock' => 30, 'price' => 420, 'discount_price' => 389, 'product_type' => ['featured']],
            ],
            'red-chilli-powder' => [
                ['amount' => '250', 'unit' => 'gm', 'sku' => 'SPC-CHI-250', 'stock' => 88, 'price' => 210, 'discount_price' => 180, 'product_type' => ['best-selling']],
                ['amount' => '500', 'unit' => 'gm', 'sku' => 'SPC-CHI-500', 'stock' => 44, 'price' => 390, 'discount_price' => 350, 'product_type' => ['featured', 'best-selling']],
            ],
            'turmeric-powder' => [
                ['amount' => '250', 'unit' => 'gm', 'sku' => 'SPC-TUR-250', 'stock' => 74, 'price' => 180, 'discount_price' => 160, 'product_type' => ['featured']],
                ['amount' => '500', 'unit' => 'gm', 'sku' => 'SPC-TUR-500', 'stock' => 32, 'price' => 330, 'discount_price' => 299, 'product_type' => []],
            ],
            'shahi-garam-masala' => [
                ['amount' => '250', 'unit' => 'gm', 'sku' => 'SPC-GRM-250', 'stock' => 48, 'price' => 320, 'discount_price' => 285, 'product_type' => ['new-arrival']],
                ['amount' => '500', 'unit' => 'gm', 'sku' => 'SPC-GRM-500', 'stock' => 22, 'price' => 590, 'discount_price' => 540, 'product_type' => ['featured', 'new-arrival']],
            ],
            'premium-cashew-nuts' => [
                ['amount' => '250', 'unit' => 'gm', 'sku' => 'NUT-CAS-250', 'stock' => 46, 'price' => 760, 'discount_price' => 710, 'product_type' => ['featured', 'best-selling']],
                ['amount' => '500', 'unit' => 'gm', 'sku' => 'NUT-CAS-500', 'stock' => 20, 'price' => 1450, 'discount_price' => 1360, 'product_type' => ['best-selling']],
            ],
            'honey-nut-power-mix' => [
                ['amount' => '250', 'unit' => 'gm', 'sku' => 'NUT-MIX-250', 'stock' => 58, 'price' => 430, 'discount_price' => 390, 'product_type' => ['featured', 'new-arrival']],
                ['amount' => '500', 'unit' => 'gm', 'sku' => 'NUT-MIX-500', 'stock' => 28, 'price' => 830, 'discount_price' => 760, 'product_type' => ['featured', 'best-selling', 'new-arrival']],
            ],
        ];
    }
}
