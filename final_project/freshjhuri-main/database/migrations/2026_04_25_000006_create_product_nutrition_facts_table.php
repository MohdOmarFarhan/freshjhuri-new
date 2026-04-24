<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_nutrition_facts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('name_en');
            $table->string('name_bn')->nullable();
            $table->string('value');
            $table->string('unit')->nullable();
            $table->decimal('per_quantity', 8, 2)->default(100);
            $table->string('per_unit')->default('g');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            $table->index(['product_id', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_nutrition_facts');
    }
};

