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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->integer('subtotal');
            $table->integer('pay_amount')->default(0);
            $table->integer('shipping_cost')->default(0);
            $table->integer('due_amount')->default(0);
            $table->integer('special_discount')->default(0);
            $table->boolean('has_free_shipping')->default(false);
            $table->longText('notes')->nullable();
            $table->enum('status', ['Pending', 'Confirmed', 'Hold', 'Processing', 'Shipping', 'Delivered', 'Cancelled'])->default('Pending');
            $table->enum('payment_type', ['cod', 'prepaid'])->default('cod');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
