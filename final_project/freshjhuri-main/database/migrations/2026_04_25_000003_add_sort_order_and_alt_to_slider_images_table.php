<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('slider_images', function (Blueprint $table) {
            $table->integer('sort_order')->default(0)->after('slider_image');
            $table->string('alt_en')->nullable()->after('sort_order');
            $table->string('alt_bn')->nullable()->after('alt_en');
        });
    }

    public function down(): void
    {
        Schema::table('slider_images', function (Blueprint $table) {
            $table->dropColumn(['sort_order', 'alt_en', 'alt_bn']);
        });
    }
};

