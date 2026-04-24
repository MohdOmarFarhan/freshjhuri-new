<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('combo_variant_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('combo_variant_id')->constrained('variants')->cascadeOnDelete();
            $table->foreignId('included_variant_id')->constrained('variants')->cascadeOnDelete();
            $table->unsignedInteger('qty')->default(1);
            $table->timestamps();

            $table->unique(['combo_variant_id', 'included_variant_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('combo_variant_items');
    }
};
