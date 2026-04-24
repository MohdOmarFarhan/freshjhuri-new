<?php

namespace Database\Seeders;

use App\Models\District;
use App\Models\Division;
use Illuminate\Database\Seeder;

class DistrictSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $districts = [
            // Barisal Division
            ['name' => 'Barguna', 'bn_name' => 'বরগুনা', 'division_id' => 5],
            ['name' => 'Barisal', 'bn_name' => 'বরিশাল', 'division_id' => 5],
            ['name' => 'Bhola', 'bn_name' => 'ভোলা', 'division_id' => 5],
            ['name' => 'Jhalokati', 'bn_name' => 'ঝালকাঠি', 'division_id' => 5],
            ['name' => 'Patuakhali', 'bn_name' => 'পটুয়াখালী', 'division_id' => 5],
            ['name' => 'Pirojpur', 'bn_name' => 'পিরোজপুর', 'division_id' => 5],

            // Chittagong Division
            ['name' => 'Bandarban', 'bn_name' => 'বান্দরবান', 'division_id' => 2],
            ['name' => 'Brahmanbaria', 'bn_name' => 'ব্রাহ্মণবাড়িয়া', 'division_id' => 2],
            ['name' => 'Chandpur', 'bn_name' => 'চাঁদপুর', 'division_id' => 2],
            ['name' => 'Chittagong', 'bn_name' => 'চট্টগ্রাম', 'division_id' => 2],
            ['name' => 'Comilla', 'bn_name' => 'কুমিল্লা', 'division_id' => 2],
            ['name' => "Cox's Bazar", 'bn_name' => 'কক্সবাজার', 'division_id' => 2],
            ['name' => 'Feni', 'bn_name' => 'ফেনী', 'division_id' => 2],
            ['name' => 'Khagrachhari', 'bn_name' => 'খাগড়াছড়ি', 'division_id' => 2],
            ['name' => 'Lakshmipur', 'bn_name' => 'লক্ষ্মীপুর', 'division_id' => 2],
            ['name' => 'Noakhali', 'bn_name' => 'নোয়াখালী', 'division_id' => 2],
            ['name' => 'Rangamati', 'bn_name' => 'রাঙ্গামাটি', 'division_id' => 2],

            // Dhaka Division
            ['name' => 'Dhaka', 'bn_name' => 'ঢাকা', 'division_id' => 1],
            ['name' => 'Faridpur', 'bn_name' => 'ফরিদপুর', 'division_id' => 1],
            ['name' => 'Gazipur', 'bn_name' => 'গাজীপুর', 'division_id' => 1],
            ['name' => 'Gopalganj', 'bn_name' => 'গোপালগঞ্জ', 'division_id' => 1],
            ['name' => 'Kishoreganj', 'bn_name' => 'কিশোরগঞ্জ', 'division_id' => 1],
            ['name' => 'Madaripur', 'bn_name' => 'মাদারীপুর', 'division_id' => 1],
            ['name' => 'Manikganj', 'bn_name' => 'মানিকগঞ্জ', 'division_id' => 1],
            ['name' => 'Munshiganj', 'bn_name' => 'মুন্সিগঞ্জ', 'division_id' => 1],
            ['name' => 'Narayanganj', 'bn_name' => 'নারায়ণগঞ্জ', 'division_id' => 1],
            ['name' => 'Narsingdi', 'bn_name' => 'নরসিংদী', 'division_id' => 1],
            ['name' => 'Rajbari', 'bn_name' => 'রাজবাড়ী', 'division_id' => 1],
            ['name' => 'Shariatpur', 'bn_name' => 'শরীয়তপুর', 'division_id' => 1],
            ['name' => 'Tangail', 'bn_name' => 'টাঙ্গাইল', 'division_id' => 1],

            // Khulna Division
            ['name' => 'Bagerhat', 'bn_name' => 'বাগেরহাট', 'division_id' => 4],
            ['name' => 'Chuadanga', 'bn_name' => 'চুয়াডাঙ্গা', 'division_id' => 4],
            ['name' => 'Jessore', 'bn_name' => 'যশোর', 'division_id' => 4],
            ['name' => 'Jhenaidah', 'bn_name' => 'ঝিনাইদহ', 'division_id' => 4],
            ['name' => 'Khulna', 'bn_name' => 'খুলনা', 'division_id' => 4],
            ['name' => 'Kushtia', 'bn_name' => 'কুষ্টিয়া', 'division_id' => 4],
            ['name' => 'Magura', 'bn_name' => 'মাগুরা', 'division_id' => 4],
            ['name' => 'Meherpur', 'bn_name' => 'মেহেরপুর', 'division_id' => 4],
            ['name' => 'Narail', 'bn_name' => 'নড়াইল', 'division_id' => 4],
            ['name' => 'Satkhira', 'bn_name' => 'সাতক্ষীরা', 'division_id' => 4],

            // Mymensingh Division
            ['name' => 'Jamalpur', 'bn_name' => 'জামালপুর', 'division_id' => 8],
            ['name' => 'Mymensingh', 'bn_name' => 'ময়মনসিংহ', 'division_id' => 8],
            ['name' => 'Netrokona', 'bn_name' => 'নেত্রকোণা', 'division_id' => 8],
            ['name' => 'Sherpur', 'bn_name' => 'শেরপুর', 'division_id' => 8],

            // Rajshahi Division
            ['name' => 'Bogra', 'bn_name' => 'বগুড়া', 'division_id' => 3],
            ['name' => 'Chapainawabganj', 'bn_name' => 'চাঁপাইনবাবগঞ্জ', 'division_id' => 3],
            ['name' => 'Joypurhat', 'bn_name' => 'জয়পুরহাট', 'division_id' => 3],
            ['name' => 'Naogaon', 'bn_name' => 'নওগাঁ', 'division_id' => 3],
            ['name' => 'Natore', 'bn_name' => 'নাটোর', 'division_id' => 3],
            ['name' => 'Pabna', 'bn_name' => 'পাবনা', 'division_id' => 3],
            ['name' => 'Rajshahi', 'bn_name' => 'রাজশাহী', 'division_id' => 3],
            ['name' => 'Sirajganj', 'bn_name' => 'সিরাজগঞ্জ', 'division_id' => 3],

            // Rangpur Division
            ['name' => 'Dinajpur', 'bn_name' => 'দিনাজপুর', 'division_id' => 7],
            ['name' => 'Gaibandha', 'bn_name' => 'গাইবান্ধা', 'division_id' => 7],
            ['name' => 'Kurigram', 'bn_name' => 'কুড়িগ্রাম', 'division_id' => 7],
            ['name' => 'Lalmonirhat', 'bn_name' => 'লালমনিরহাট', 'division_id' => 7],
            ['name' => 'Nilphamari', 'bn_name' => 'নীলফামারী', 'division_id' => 7],
            ['name' => 'Panchagarh', 'bn_name' => 'পঞ্চগড়', 'division_id' => 7],
            ['name' => 'Rangpur', 'bn_name' => 'রংপুর', 'division_id' => 7],
            ['name' => 'Thakurgaon', 'bn_name' => 'ঠাকুরগাঁও', 'division_id' => 7],

            // Sylhet Division
            ['name' => 'Habiganj', 'bn_name' => 'হবিগঞ্জ', 'division_id' => 6],
            ['name' => 'Moulvibazar', 'bn_name' => 'মৌলভীবাজার', 'division_id' => 6],
            ['name' => 'Sunamganj', 'bn_name' => 'সুনামগঞ্জ', 'division_id' => 6],
            ['name' => 'Sylhet', 'bn_name' => 'সিলেট', 'division_id' => 6],
        ];

        foreach ($districts as $district) {
            District::updateOrCreate(
                ['name' => $district['name'], 'division_id' => $district['division_id']],
                $district
            );
        }
    }
}
