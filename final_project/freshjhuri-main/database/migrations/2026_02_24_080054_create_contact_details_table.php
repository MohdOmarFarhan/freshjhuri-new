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
        Schema::create('contact_details', function (Blueprint $table) {
            $table->id();
            $table->string('image')->nullable();
            $table->string('phone');
            $table->string('whats_app')->naullable();
            $table->string('email')->unique();
            $table->string('corporate_office_en');
            $table->string('corporate_office_bn');
            $table->string('local_office_1_en')->nullable();
            $table->string('local_office_1_bn')->nullable();
            $table->string('local_office_2_en')->nullable();
            $table->string('local_office_2_bn')->nullable();
            $table->string('local_office_3_en')->nullable();
            $table->string('local_office_3_bn')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contact_details');
    }
};
