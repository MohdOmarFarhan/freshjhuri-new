<?php

namespace Database\Seeders;

use App\Models\ProductStatus;
use Illuminate\Database\Seeder;

class ProductStatusSeeder extends Seeder
{
    public function run(): void
    {
        $statuses = [
            ['name_en' => 'New Arrival', 'name_bn' => 'New Arrival'],
            ['name_en' => 'Trending', 'name_bn' => 'Trending'],
            ['name_en' => 'Best Seller', 'name_bn' => 'Best Seller'],
            ['name_en' => 'Limited Stock', 'name_bn' => 'Limited Stock'],
        ];

        foreach ($statuses as $status) {
            ProductStatus::updateOrCreate(
                ['name_en' => $status['name_en']],
                $status
            );
        }
    }
}
