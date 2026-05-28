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
    Schema::create('purchase_order_items', function (Blueprint $table) {
        $table->id('po_item_id'); // INT AUTO_INCREMENT Primary Key
        $table->string('po_number', 50);    // Foreign Key
        $table->string('product_code', 50); // Foreign Key
        $table->integer('quantity');
        $table->decimal('unit_price', 10, 2);
        $table->decimal('total', 12, 2);
        $table->timestamps();

        // Relationships
        $table->foreign('po_number')->references('po_number')->on('purchase_orders')->onDelete('cascade');
        $table->foreign('product_code')->references('product_code')->on('products')->onDelete('cascade');
    });
}

    /**
     * Reverse the migrations.
     */
   
     public function down(): void
    {
        Schema::dropIfExists('purchase_order_items');
    }
};
