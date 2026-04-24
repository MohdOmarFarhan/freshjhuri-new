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
        Schema::table('orders', function (Blueprint $table) {
            $table->decimal('subtotal', 10, 2)->change();
            $table->decimal('pay_amount', 10, 2)->change();
            $table->decimal('shipping_cost', 10, 2)->change();
            $table->decimal('due_amount', 10, 2)->change();
            $table->decimal('special_discount', 10, 2)->change();
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->decimal('subtotal', 10, 2)->change();
            $table->decimal('unit_price', 10, 2)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->integer('subtotal')->change();
            $table->integer('pay_amount')->change();
            $table->integer('shipping_cost')->change();
            $table->integer('due_amount')->change();
            $table->integer('special_discount')->change();
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->integer('subtotal')->change();
            $table->integer('unit_price')->change();
        });
    }
};
