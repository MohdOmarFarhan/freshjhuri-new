<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('badge_en')->nullable()->after('short_desc_bn');
            $table->string('badge_bn')->nullable()->after('badge_en');
            $table->boolean('is_organic')->default(false)->after('status');
            $table->boolean('is_sugar_free')->default(false)->after('is_organic');
            $table->boolean('is_pre_order')->default(false)->after('is_sugar_free');
            $table->boolean('is_top_selling')->default(false)->after('is_pre_order');
            $table->longText('origin_story_en')->nullable()->after('description_bn');
            $table->longText('origin_story_bn')->nullable()->after('origin_story_en');
            $table->string('video_url', 2048)->nullable()->after('hover_image');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'badge_en',
                'badge_bn',
                'is_organic',
                'is_sugar_free',
                'is_pre_order',
                'is_top_selling',
                'origin_story_en',
                'origin_story_bn',
                'video_url',
            ]);
        });
    }
};

