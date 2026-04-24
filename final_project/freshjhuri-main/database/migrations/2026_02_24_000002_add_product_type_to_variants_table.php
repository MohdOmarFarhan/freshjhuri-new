<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('variants', function (Blueprint $table) {
            $table->enum('product_type', ['featured', 'new-arrival', 'upcoming', 'none', 'bestselling'])
                ->nullable()
                ->default(null)
                ->after('discount_price');
        });
    }

    public function down(): void
    {
        Schema::table('variants', function (Blueprint $table) {
            $table->dropColumn('product_type');
        });
    }
};
