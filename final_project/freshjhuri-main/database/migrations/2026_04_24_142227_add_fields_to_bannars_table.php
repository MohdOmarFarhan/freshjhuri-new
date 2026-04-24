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
        Schema::table('bannars', function (Blueprint $table) {
            $table->string('tag_en')->nullable()->after('title_bn');
            $table->string('tag_bn')->nullable()->after('tag_en');
            $table->string('theme_color')->nullable()->after('category_id')->comment('Hex color code e.g. #f59e0b');
            $table->string('btn_text_en')->nullable()->after('theme_color');
            $table->string('btn_text_bn')->nullable()->after('btn_text_en');
            $table->string('btn_link')->nullable()->after('btn_text_bn');
            $table->integer('sort_order')->default(0)->after('btn_link');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bannars', function (Blueprint $table) {
            $table->dropColumn([
                'tag_en',
                'tag_bn',
                'theme_color',
                'btn_text_en',
                'btn_text_bn',
                'btn_link',
                'sort_order'
            ]);
        });
    }
};
