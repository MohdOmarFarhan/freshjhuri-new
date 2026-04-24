<?php

namespace Database\Seeders;

use App\Models\Bannar;
use App\Models\BrandMarquee;
use App\Models\Category;
use App\Models\CommonSetting;
use App\Models\ContactDetail;
use App\Models\Footer;
use App\Models\HomepageSection;
use App\Models\PaymentMedia;
use App\Models\Product;
use App\Models\ProductAttribute;
use App\Models\ProductNutritionFact;
use App\Models\ProductRelation;
use App\Models\Service;
use App\Models\ServiceVideo;
use App\Models\Social;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->truncateApplicationTables();

        $this->call([
            PermissionSeeder::class,
            DivisionSeeder::class,
            DistrictSeeder::class,
            ThanaSeeder::class,
            SizeSeeder::class,
        ]);

        $this->seedAccessControl();
        $categories = $this->seedCategories();
        $this->seedStorefrontChrome();

        $this->call([
            ProductSeeder::class,
            VariantSeeder::class,
        ]);

        $this->seedProductDetailMeta();

        $this->seedBanners($categories);
        $this->seedHomepageSections($categories);
        $this->seedBrandMarquees();
        $this->seedServices();
        $this->seedServiceVideos();
    }

    private function truncateApplicationTables(): void
    {
        $tables = [
            'model_has_roles',
            'model_has_permissions',
            'role_has_permissions',
            'permissions',
            'roles',
            'product_reviews',
            'combo_variant_items',
            'variant_packagings',
            'variants',
            'slider_images',
            'product_features',
            'product_attributes',
            'product_nutrition_facts',
            'product_relations',
            'products',
            'homepage_sections',
            'bannars',
            'brand_marquees',
            'service_videos',
            'services',
            'payment_media',
            'contact_messages',
            'contact_details',
            'socials',
            'footers',
            'common_settings',
            'carts',
            'shipping_addresses',
            'order_items',
            'orders',
            'visitors',
            'categories',
            'sizes',
            'thanas',
            'districts',
            'divisions',
            'users',
        ];

        DB::statement('SET FOREIGN_KEY_CHECKS=0');

        foreach ($tables as $table) {
            if (Schema::hasTable($table)) {
                DB::table($table)->truncate();
            }
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=1');
    }

    private function seedAccessControl(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $allPermissions = Permission::query()->pluck('name')->all();

        $superAdminRole = Role::firstOrCreate(['name' => 'Super Admin', 'guard_name' => 'web']);
        $adminRole = Role::firstOrCreate(['name' => 'Admin', 'guard_name' => 'web']);
        $legacySuperAdminRole = Role::firstOrCreate(['name' => 'super-admin', 'guard_name' => 'web']);
        $legacyAdminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $userRole = Role::firstOrCreate(['name' => 'user', 'guard_name' => 'web']);

        $superAdminRole->syncPermissions($allPermissions);
        $adminRole->syncPermissions($allPermissions);
        $legacySuperAdminRole->syncPermissions($allPermissions);
        $legacyAdminRole->syncPermissions($allPermissions);
        $userRole->syncPermissions([]);

        $superAdmin = User::create([
            'name' => 'System Admin',
            'email' => 'admin@freshjhuri.com',
            'phone' => '01700000000',
            'password' => 'password',
            'email_verified_at' => now(),
            'status' => 'active',
        ]);
        $superAdmin->syncRoles(['Super Admin', 'super-admin']);

        $admin = User::create([
            'name' => 'Catalog Manager',
            'email' => 'manager@freshjhuri.com',
            'phone' => '01711111111',
            'password' => 'password',
            'email_verified_at' => now(),
            'status' => 'active',
        ]);
        $admin->syncRoles(['Admin', 'admin']);

        $customer = User::create([
            'name' => 'Demo Customer',
            'email' => 'customer@example.com',
            'phone' => '01812345678',
            'password' => 'password',
            'email_verified_at' => now(),
            'status' => 'active',
        ]);
        $customer->syncRoles(['user']);
    }

    private function seedCategories()
    {
        $items = [
            [
                'name_en' => 'Honey',
                'name_bn' => 'Honey',
                'desc_en' => 'Raw, floral, and premium honey selections for daily use and gifting.',
                'desc_bn' => 'Raw, floral, and premium honey selections for daily use and gifting.',
                'is_featured' => true,
                'slug' => 'honey',
                'image' => '/ui/images/honey.png',
                'status' => true,
                'sort_order' => 1,
            ],
            [
                'name_en' => 'Seasonal Fruits',
                'name_bn' => 'Seasonal Fruits',
                'desc_en' => 'Fresh seasonal fruit collections with a focus on mango and litchi selections.',
                'desc_bn' => 'Fresh seasonal fruit collections with a focus on mango and litchi selections.',
                'is_featured' => true,
                'slug' => 'seasonal-fruits',
                'image' => '/ui/images/mango.png',
                'status' => true,
                'sort_order' => 2,
            ],
            [
                'name_en' => 'Premium Dates',
                'name_bn' => 'Premium Dates',
                'desc_en' => 'Imported dates with premium gifting, fasting, and snacking appeal.',
                'desc_bn' => 'Imported dates with premium gifting, fasting, and snacking appeal.',
                'is_featured' => true,
                'slug' => 'premium-dates',
                'image' => '/ui/images/dates.png',
                'status' => true,
                'sort_order' => 3,
            ],
            [
                'name_en' => 'Cooking Essentials',
                'name_bn' => 'Cooking Essentials',
                'desc_en' => 'Daily pantry staples including ghee and traditional oils.',
                'desc_bn' => 'Daily pantry staples including ghee and traditional oils.',
                'is_featured' => true,
                'slug' => 'cooking-essentials',
                'image' => '/ui/images/honey.png',
                'status' => true,
                'sort_order' => 4,
            ],
            [
                'name_en' => 'Spices',
                'name_bn' => 'Spices',
                'desc_en' => 'Fresh spice and masala listings for everyday cooking and premium blends.',
                'desc_bn' => 'Fresh spice and masala listings for everyday cooking and premium blends.',
                'is_featured' => true,
                'slug' => 'spices',
                'image' => '/ui/images/spices.png',
                'status' => true,
                'sort_order' => 5,
            ],
            [
                'name_en' => 'Nuts And Dry Fruits',
                'name_bn' => 'Nuts And Dry Fruits',
                'desc_en' => 'Snack-ready and gifting-focused dry fruit collections.',
                'desc_bn' => 'Snack-ready and gifting-focused dry fruit collections.',
                'is_featured' => false,
                'slug' => 'nuts-dry-fruits',
                'image' => '/ui/images/dates.png',
                'status' => true,
                'sort_order' => 6,
            ],
        ];

        foreach ($items as $item) {
            Category::create($item);
        }

        return Category::query()->get()->keyBy('slug');
    }

    private function seedStorefrontChrome(): void
    {
        CommonSetting::create([
            'project_name' => 'Fresh Jhuri Demo',
            'logo_1' => '/ui/images/honey.png',
            'logo_2' => '/ui/images/mango.png',
            'slogan' => 'Fresh pantry and seasonal essentials',
            'est' => '2026',
            'email' => 'support@freshjhuri.com',
            'phone' => '01700000000',
            'whatsapp' => '01700000000',
            'address' => 'Demo address, Dhaka, Bangladesh',
            'copyright' => 'Copyright Fresh Jhuri Demo',
            'developer_logo' => '/ui/images/dates.png',
            'banner_image' => '/ui/images/spices.png',
            'facebook_pixel' => null,
        ]);

        Footer::create([
            'logo' => '/ui/images/honey.png',
            'description_en' => 'Demo storefront footer content for the seeded catalog.',
            'description_bn' => 'Demo storefront footer content for the seeded catalog.',
            'office_address_en' => 'Dhaka Demo Office',
            'office_address_bn' => 'Dhaka Demo Office',
            'mobile_en' => '01700000000',
            'mobile_bn' => '01700000000',
            'hotline_en' => '09610000000',
            'hotline_bn' => '09610000000',
            'image' => '/ui/images/mango.png',
            'copyright' => 'Fresh Jhuri Demo',
        ]);

        ContactDetail::create([
            'image' => '/ui/images/spices.png',
            'phone' => '01700000000',
            'whats_app' => '01700000000',
            'email' => 'support@freshjhuri.com',
            'corporate_office_en' => 'Dhaka Corporate Office',
            'corporate_office_bn' => 'Dhaka Corporate Office',
            'local_office_1_en' => 'Rajshahi Hub',
            'local_office_1_bn' => 'Rajshahi Hub',
            'local_office_2_en' => 'Chattogram Hub',
            'local_office_2_bn' => 'Chattogram Hub',
            'local_office_3_en' => 'Khulna Hub',
            'local_office_3_bn' => 'Khulna Hub',
        ]);

        foreach ([
            ['name' => 'Facebook', 'link' => 'https://facebook.com/freshjhuri-demo', 'image' => '/ui/images/honey.png'],
            ['name' => 'Instagram', 'link' => 'https://instagram.com/freshjhuri-demo', 'image' => '/ui/images/mango.png'],
            ['name' => 'YouTube', 'link' => 'https://youtube.com/@freshjhuri-demo', 'image' => '/ui/images/spices.png'],
        ] as $social) {
            Social::create($social);
        }

        foreach ([
            ['name' => 'bKash', 'pay_number' => '01700000000', 'icon' => '/ui/images/honey.png'],
            ['name' => 'Nagad', 'pay_number' => '01800000000', 'icon' => '/ui/images/mango.png'],
            ['name' => 'Rocket', 'pay_number' => '01900000000', 'icon' => '/ui/images/dates.png'],
        ] as $media) {
            PaymentMedia::create($media);
        }
    }

    private function seedBanners($categories): void
    {
        $items = [
            [
                'title_en' => 'Pure Honey Collection',
                'title_bn' => 'Pure Honey Collection',
                'short_desc_en' => 'Raw honey for gifting and daily use.',
                'short_desc_bn' => 'Raw honey for gifting and daily use.',
                'long_desc_en' => 'A premium banner for the main honey collection using the imported UI visual asset.',
                'long_desc_bn' => 'A premium banner for the main honey collection using the imported UI visual asset.',
                'image' => '/ui/images/honey.png',
                'category_slug' => 'honey',
                'tag_en' => 'Best Seller',
                'tag_bn' => 'Best Seller',
                'theme_color' => '#f59e0b',
                'btn_text_en' => 'Shop Honey',
                'btn_text_bn' => 'Shop Honey',
                'btn_link' => '/products?category=honey',
                'sort_order' => 1,
            ],
            [
                'title_en' => 'Mango Season Is Here',
                'title_bn' => 'Mango Season Is Here',
                'short_desc_en' => 'Fresh fruit listings for the seasonal slider.',
                'short_desc_bn' => 'Fresh fruit listings for the seasonal slider.',
                'long_desc_en' => 'A bright seasonal fruit banner driven by the mango UI asset.',
                'long_desc_bn' => 'A bright seasonal fruit banner driven by the mango UI asset.',
                'image' => '/ui/images/mango.png',
                'category_slug' => 'seasonal-fruits',
                'tag_en' => 'New Arrival',
                'tag_bn' => 'New Arrival',
                'theme_color' => '#fb923c',
                'btn_text_en' => 'Shop Fruits',
                'btn_text_bn' => 'Shop Fruits',
                'btn_link' => '/products?category=seasonal-fruits',
                'sort_order' => 2,
            ],
            [
                'title_en' => 'Premium Dates Picks',
                'title_bn' => 'Premium Dates Picks',
                'short_desc_en' => 'Imported date assortments for gifting and daily snacking.',
                'short_desc_bn' => 'Imported date assortments for gifting and daily snacking.',
                'long_desc_en' => 'A banner dedicated to the premium dates category using the reused UI date image.',
                'long_desc_bn' => 'A banner dedicated to the premium dates category using the reused UI date image.',
                'image' => '/ui/images/dates.png',
                'category_slug' => 'premium-dates',
                'tag_en' => 'Imported',
                'tag_bn' => 'Imported',
                'theme_color' => '#b45309',
                'btn_text_en' => 'Shop Dates',
                'btn_text_bn' => 'Shop Dates',
                'btn_link' => '/products?category=premium-dates',
                'sort_order' => 3,
            ],
            [
                'title_en' => 'Fresh Spice Shelf',
                'title_bn' => 'Fresh Spice Shelf',
                'short_desc_en' => 'Everyday masala and pantry spice packs.',
                'short_desc_bn' => 'Everyday masala and pantry spice packs.',
                'long_desc_en' => 'A spice-led banner that gives the homepage a stronger visual category spread.',
                'long_desc_bn' => 'A spice-led banner that gives the homepage a stronger visual category spread.',
                'image' => '/ui/images/spices.png',
                'category_slug' => 'spices',
                'tag_en' => 'Kitchen Picks',
                'tag_bn' => 'Kitchen Picks',
                'theme_color' => '#dc2626',
                'btn_text_en' => 'Shop Spices',
                'btn_text_bn' => 'Shop Spices',
                'btn_link' => '/products?category=spices',
                'sort_order' => 4,
            ],
        ];

        foreach ($items as $item) {
            Bannar::create([
                'title_en' => $item['title_en'],
                'title_bn' => $item['title_bn'],
                'short_desc_en' => $item['short_desc_en'],
                'short_desc_bn' => $item['short_desc_bn'],
                'long_desc_en' => $item['long_desc_en'],
                'long_desc_bn' => $item['long_desc_bn'],
                'image' => $item['image'],
                'category_id' => $categories[$item['category_slug']]->id ?? null,
                'tag_en' => $item['tag_en'],
                'tag_bn' => $item['tag_bn'],
                'theme_color' => $item['theme_color'],
                'btn_text_en' => $item['btn_text_en'],
                'btn_text_bn' => $item['btn_text_bn'],
                'btn_link' => $item['btn_link'],
                'sort_order' => $item['sort_order'],
            ]);
        }
    }

    private function seedHomepageSections($categories): void
    {
        $items = [
            ['title_en' => 'Featured Picks', 'title_bn' => 'Featured Picks', 'subtitle_en' => 'Curated highlights from the demo catalog', 'subtitle_bn' => 'Curated highlights from the demo catalog', 'type' => 'featured', 'category_slug' => null, 'theme_color' => '#f59e0b', 'sort_order' => 1],
            ['title_en' => 'Top Selling Now', 'title_bn' => 'Top Selling Now', 'subtitle_en' => 'Best performing products for the product slider', 'subtitle_bn' => 'Best performing products for the product slider', 'type' => 'best-selling', 'category_slug' => null, 'theme_color' => '#f97316', 'sort_order' => 2],
            ['title_en' => 'New Arrivals', 'title_bn' => 'New Arrivals', 'subtitle_en' => 'Freshly added and seasonal products', 'subtitle_bn' => 'Freshly added and seasonal products', 'type' => 'new-arrival', 'category_slug' => null, 'theme_color' => '#fb7185', 'sort_order' => 3],
            ['title_en' => 'Honey Collection', 'title_bn' => 'Honey Collection', 'subtitle_en' => 'Category-driven product slider section', 'subtitle_bn' => 'Category-driven product slider section', 'type' => 'category', 'category_slug' => 'honey', 'theme_color' => '#f59e0b', 'sort_order' => 4],
            ['title_en' => 'Seasonal Fruits', 'title_bn' => 'Seasonal Fruits', 'subtitle_en' => 'Fruit picks sourced from the demo catalog', 'subtitle_bn' => 'Fruit picks sourced from the demo catalog', 'type' => 'category', 'category_slug' => 'seasonal-fruits', 'theme_color' => '#fb923c', 'sort_order' => 5],
            ['title_en' => 'Premium Dates', 'title_bn' => 'Premium Dates', 'subtitle_en' => 'Rich date assortments for gifting and snacking', 'subtitle_bn' => 'Rich date assortments for gifting and snacking', 'type' => 'category', 'category_slug' => 'premium-dates', 'theme_color' => '#a16207', 'sort_order' => 6],
            ['title_en' => 'Spice Shelf', 'title_bn' => 'Spice Shelf', 'subtitle_en' => 'Signature masala and pantry essentials', 'subtitle_bn' => 'Signature masala and pantry essentials', 'type' => 'category', 'category_slug' => 'spices', 'theme_color' => '#dc2626', 'sort_order' => 7],
        ];

        foreach ($items as $item) {
            HomepageSection::create([
                'title_en' => $item['title_en'],
                'title_bn' => $item['title_bn'],
                'subtitle_en' => $item['subtitle_en'],
                'subtitle_bn' => $item['subtitle_bn'],
                'type' => $item['type'],
                'category_id' => $item['category_slug'] ? ($categories[$item['category_slug']]->id ?? null) : null,
                'theme_color' => $item['theme_color'],
                'sort_order' => $item['sort_order'],
                'status' => true,
            ]);
        }
    }

    private function seedBrandMarquees(): void
    {
        foreach ([
            ['text_en' => 'Pure honey and pantry essentials', 'text_bn' => 'Pure honey and pantry essentials', 'icon' => 'Shield', 'image' => '/ui/images/honey.png', 'color' => '#111827', 'bg_color' => '#fef3c7', 'sort_order' => 1, 'status' => true],
            ['text_en' => 'Seasonal fruits with reusable UI visuals', 'text_bn' => 'Seasonal fruits with reusable UI visuals', 'icon' => 'Leaf', 'image' => '/ui/images/mango.png', 'color' => '#7c2d12', 'bg_color' => '#ffedd5', 'sort_order' => 2, 'status' => true],
            ['text_en' => 'Premium dates and spice assortments', 'text_bn' => 'Premium dates and spice assortments', 'icon' => 'BadgeCheck', 'image' => '/ui/images/dates.png', 'color' => '#7f1d1d', 'bg_color' => '#fee2e2', 'sort_order' => 3, 'status' => true],
        ] as $item) {
            BrandMarquee::create($item);
        }
    }

    private function seedProductDetailMeta(): void
    {
        $products = Product::query()->select('id', 'slug')->get()->keyBy('slug');

        $seed = function (string $slug, array $attributes, array $nutrition): void {
            $product = Product::where('slug', $slug)->first();
            if (! $product) {
                return;
            }

            foreach ($attributes as $i => $attr) {
                ProductAttribute::create([
                    'product_id' => $product->id,
                    'key' => $attr['key'],
                    'label_en' => $attr['label_en'] ?? null,
                    'label_bn' => $attr['label_bn'] ?? null,
                    'value_en' => $attr['value_en'],
                    'value_bn' => $attr['value_bn'] ?? null,
                    'sort_order' => $i + 1,
                ]);
            }

            foreach ($nutrition as $i => $fact) {
                ProductNutritionFact::create([
                    'product_id' => $product->id,
                    'name_en' => $fact['name_en'],
                    'name_bn' => $fact['name_bn'] ?? null,
                    'value' => $fact['value'],
                    'unit' => $fact['unit'] ?? null,
                    'per_quantity' => $fact['per_quantity'] ?? 100,
                    'per_unit' => $fact['per_unit'] ?? 'g',
                    'sort_order' => $i + 1,
                ]);
            }
        };

        $seed('litchi-flower-honey',
            [
                ['key' => 'flower_type', 'label_en' => 'Flower Type', 'label_bn' => 'Flower Type', 'value_en' => 'Litchi', 'value_bn' => 'Litchi'],
                ['key' => 'processing', 'label_en' => 'Processing', 'label_bn' => 'Processing', 'value_en' => 'Gently filtered', 'value_bn' => 'Gently filtered'],
                ['key' => 'packaging', 'label_en' => 'Packaging', 'label_bn' => 'Packaging', 'value_en' => 'Food-grade jar', 'value_bn' => 'Food-grade jar'],
                ['key' => 'origin', 'label_en' => 'Origin', 'label_bn' => 'Origin', 'value_en' => 'Rajshahi, BD', 'value_bn' => 'Rajshahi, BD'],
            ],
            [
                ['name_en' => 'Energy', 'name_bn' => 'Energy', 'value' => '304', 'unit' => 'kcal', 'per_quantity' => 100, 'per_unit' => 'g'],
                ['name_en' => 'Carbohydrate', 'name_bn' => 'Carbohydrate', 'value' => '82', 'unit' => 'g', 'per_quantity' => 100, 'per_unit' => 'g'],
                ['name_en' => 'Sugar', 'name_bn' => 'Sugar', 'value' => '80', 'unit' => 'g', 'per_quantity' => 100, 'per_unit' => 'g'],
            ]
        );

        $seed('ajwa-dates',
            [
                ['key' => 'type', 'label_en' => 'Type', 'label_bn' => 'Type', 'value_en' => 'Ajwa', 'value_bn' => 'Ajwa'],
                ['key' => 'origin', 'label_en' => 'Origin', 'label_bn' => 'Origin', 'value_en' => 'Imported', 'value_bn' => 'Imported'],
                ['key' => 'texture', 'label_en' => 'Texture', 'label_bn' => 'Texture', 'value_en' => 'Soft', 'value_bn' => 'Soft'],
            ],
            [
                ['name_en' => 'Energy', 'name_bn' => 'Energy', 'value' => '277', 'unit' => 'kcal', 'per_quantity' => 100, 'per_unit' => 'g'],
                ['name_en' => 'Fiber', 'name_bn' => 'Fiber', 'value' => '7', 'unit' => 'g', 'per_quantity' => 100, 'per_unit' => 'g'],
                ['name_en' => 'Potassium', 'name_bn' => 'Potassium', 'value' => '696', 'unit' => 'mg', 'per_quantity' => 100, 'per_unit' => 'g'],
            ]
        );

        foreach ([
            ['product' => 'litchi-flower-honey', 'related' => 'ajwa-dates', 'discount' => 5, 'sort_order' => 1],
            ['product' => 'litchi-flower-honey', 'related' => 'red-chilli-powder', 'discount' => 5, 'sort_order' => 2],
            ['product' => 'ajwa-dates', 'related' => 'premium-cashew-nuts', 'discount' => 5, 'sort_order' => 1],
            ['product' => 'ajwa-dates', 'related' => 'honey-nut-power-mix', 'discount' => 5, 'sort_order' => 2],
        ] as $rel) {
            $p = $products->get($rel['product']);
            $r = $products->get($rel['related']);
            if (! $p || ! $r) {
                continue;
            }
            ProductRelation::create([
                'product_id' => $p->id,
                'related_product_id' => $r->id,
                'type' => 'frequently_bought_together',
                'discount_percent' => $rel['discount'],
                'sort_order' => $rel['sort_order'],
            ]);
        }
    }

    private function seedServices(): void
    {
        if (! Schema::hasTable('services')) {
            return;
        }

        foreach ([
            [
                'title_en' => 'Curated Quality',
                'title_bn' => 'Curated Quality',
                'description_en' => 'Each demo product is placed to make the storefront feel complete and believable.',
                'description_bn' => 'Each demo product is placed to make the storefront feel complete and believable.',
                'benefits_en' => ['Clean listings', 'Balanced categories', 'Consistent imagery'],
                'benefits_bn' => ['Clean listings', 'Balanced categories', 'Consistent imagery'],
                'image' => '/ui/images/honey.png',
                'video_url' => null,
                'status' => true,
                'sort_order' => 1,
            ],
            [
                'title_en' => 'Fast Delivery Story',
                'title_bn' => 'Fast Delivery Story',
                'description_en' => 'Dummy service content keeps the homepage backend showcase from looking empty.',
                'description_bn' => 'Dummy service content keeps the homepage backend showcase from looking empty.',
                'benefits_en' => ['Quick dispatch tone', 'Operational trust', 'Homepage balance'],
                'benefits_bn' => ['Quick dispatch tone', 'Operational trust', 'Homepage balance'],
                'image' => '/ui/images/mango.png',
                'video_url' => null,
                'status' => true,
                'sort_order' => 2,
            ],
            [
                'title_en' => 'Trusted Sourcing',
                'title_bn' => 'Trusted Sourcing',
                'description_en' => 'A third service block rounds out the admin showcase with believable content.',
                'description_bn' => 'A third service block rounds out the admin showcase with believable content.',
                'benefits_en' => ['Category depth', 'Better visuals', 'Stronger demo data'],
                'benefits_bn' => ['Category depth', 'Better visuals', 'Stronger demo data'],
                'image' => '/ui/images/spices.png',
                'video_url' => null,
                'status' => true,
                'sort_order' => 3,
            ],
        ] as $item) {
            Service::create($item);
        }
    }

    private function seedServiceVideos(): void
    {
        foreach ([
            ['title_en' => 'Storefront Overview', 'title_bn' => 'Storefront Overview', 'video_link' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'status' => true],
            ['title_en' => 'Product Slider Showcase', 'title_bn' => 'Product Slider Showcase', 'video_link' => 'https://www.youtube.com/watch?v=ysz5S6PUM-U', 'status' => true],
        ] as $item) {
            ServiceVideo::create($item);
        }
    }
}
