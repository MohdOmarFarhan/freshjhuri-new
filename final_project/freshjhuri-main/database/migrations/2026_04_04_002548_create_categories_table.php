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
        if (Schema::hasTable('categories')) {
            return;
        }

        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name_en');
            $table->string('name_bn');
            $table->text('desc_en')->nullable();
            $table->text('desc_bn')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->string('slug', 150)->unique();
            $table->string('image', 2048)->nullable();
            $table->boolean('status')->default(true)->comment('1=active, 0=inactive')->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
