<?php

namespace Database\Seeders;

use App\Models\District;
use Illuminate\Database\Seeder;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get Districts
        $dhakaDistrict = District::where('name', 'Dhaka')->first();
        $gazipurDistrict = District::where('name', 'Gazipur')->first();
        $narayanganjDistrict = District::where('name', 'Narayanganj')->first(); // Note: DistrictSeeder uses 'Narayanganj' (corrected spelling if needed, checked seeder: it says 'Narayanganj' with 'Narayanganj' bn_name)
        // Wait, in DistrictSeeder I used 'Narayanganj'. In LocationSeeder it was 'Narayanganj'. Ideally they match.
        // In my DistrictSeeder: ['name' => 'Narayanganj', 'bn_name' => 'নারায়ণগঞ্জ', 'division_id' => 1],

        $chittagongDistrict = District::where('name', 'Chittagong')->first();
        $coxsBazarDistrict = District::where('name', "Cox's Bazar")->first();

        // Dhaka Thanas
        if ($dhakaDistrict) {
            $dhakaDistrict->thanas()->firstOrCreate(['name' => 'Dhanmondi'], ['bn_name' => 'ধানমন্ডি', 'shipping_cost' => 60]);
            $dhakaDistrict->thanas()->firstOrCreate(['name' => 'Gulshan'], ['bn_name' => 'গুলশান', 'shipping_cost' => 60]);
            $dhakaDistrict->thanas()->firstOrCreate(['name' => 'Mirpur'], ['bn_name' => 'মিরপুর', 'shipping_cost' => 60]);
            $dhakaDistrict->thanas()->firstOrCreate(['name' => 'Uttara'], ['bn_name' => 'উত্তরা', 'shipping_cost' => 60]);
            $dhakaDistrict->thanas()->firstOrCreate(['name' => 'Mohammadpur'], ['bn_name' => 'মোহাম্মদপুর', 'shipping_cost' => 60]);
        }

        // Gazipur Thanas
        if ($gazipurDistrict) {
            $gazipurDistrict->thanas()->firstOrCreate(['name' => 'Gazipur Sadar'], ['bn_name' => 'গাজীপুর সদর', 'shipping_cost' => 100]);
            $gazipurDistrict->thanas()->firstOrCreate(['name' => 'Tongi'], ['bn_name' => 'টঙ্গী', 'shipping_cost' => 80]);
            $gazipurDistrict->thanas()->firstOrCreate(['name' => 'Kaliakair'], ['bn_name' => 'কালিয়াকৈর', 'shipping_cost' => 100]);
        }

        // Narayanganj Thanas
        if ($narayanganjDistrict) {
            $narayanganjDistrict->thanas()->firstOrCreate(['name' => 'Narayanganj Sadar'], ['bn_name' => 'নারায়ণগঞ্জ সদর', 'shipping_cost' => 80]);
            $narayanganjDistrict->thanas()->firstOrCreate(['name' => 'Rupganj'], ['bn_name' => 'রূপগঞ্জ', 'shipping_cost' => 100]);
        }

        // Chittagong Thanas
        if ($chittagongDistrict) {
            $chittagongDistrict->thanas()->firstOrCreate(['name' => 'Kotwali'], ['bn_name' => 'কোতোয়ালী', 'shipping_cost' => 120]);
            $chittagongDistrict->thanas()->firstOrCreate(['name' => 'Panchlaish'], ['bn_name' => 'পাঁচলাইশ', 'shipping_cost' => 120]);
        }

        // Cox's Bazar Thanas
        if ($coxsBazarDistrict) {
            $coxsBazarDistrict->thanas()->firstOrCreate(['name' => 'Cox\'s Bazar Sadar'], ['bn_name' => 'কক্সবাজার সদর', 'shipping_cost' => 150]);
            $coxsBazarDistrict->thanas()->firstOrCreate(['name' => 'Teknaf'], ['bn_name' => 'টেকনাফ', 'shipping_cost' => 180]);
        }
    }
}
