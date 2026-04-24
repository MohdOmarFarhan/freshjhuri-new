<?php

namespace Database\Seeders;

use App\Models\Size;
use Illuminate\Database\Seeder;

class SizeSeeder extends Seeder
{
    public function run(): void
    {
        $sizes = [
            ['unit_en' => 'kg', 'unit_bn' => 'kg', 'amount_en' => '1', 'amount_bn' => '1'],
            ['unit_en' => 'kg', 'unit_bn' => 'kg', 'amount_en' => '2', 'amount_bn' => '2'],
            ['unit_en' => 'kg', 'unit_bn' => 'kg', 'amount_en' => '5', 'amount_bn' => '5'],
            ['unit_en' => 'gm', 'unit_bn' => 'gm', 'amount_en' => '500', 'amount_bn' => '500'],
            ['unit_en' => 'piece', 'unit_bn' => 'piece', 'amount_en' => '1', 'amount_bn' => '1'],
        ];

        foreach ($sizes as $size) {
            Size::updateOrCreate(
                [
                    'unit_en' => $size['unit_en'],
                    'amount_en' => $size['amount_en'],
                ],
                $size
            );
        }
    }
}
