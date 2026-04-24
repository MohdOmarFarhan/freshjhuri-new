<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->boolean('is_free_shipping')->default(false)->after('feature_image');
        });

        Schema::table('variants', function (Blueprint $table) {
            $table->dropColumn('is_free_shipping');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('variants', function (Blueprint $table) {
            $table->boolean('is_free_shipping')->default(false)->after('discount_price');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('is_free_shipping');
        });
    }
};
