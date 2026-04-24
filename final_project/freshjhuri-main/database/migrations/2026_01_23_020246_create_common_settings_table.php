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
        Schema::create('common_settings', function (Blueprint $table) {
            $table->id();
            $table->string('project_name');
            $table->string('logo_1')->nullable();
            $table->string('logo_2')->nullable();
            $table->string('slogan');
            $table->string('est');
            $table->string('email')->unique();
            $table->string('phone');
            $table->string('whatsapp');
            $table->string('address');
            $table->string('copyright');
            $table->string('developer_logo')->nullable();
            $table->string('banner_image')->nullable();
            $table->longText('facebook_pixel')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('common_settings');
    }
};
