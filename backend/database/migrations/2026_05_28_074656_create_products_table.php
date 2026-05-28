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
        Schema::create('products', function (Blueprint $table) {
        $table->string('product_code', 50)->primary();
        $table->string('product_name', 150);
        $table->string('brand', 100);
        $table->decimal('unit_price', 10, 2);
        $table->string('status', 20);
        $table->string('category_id', 50); // Foreign Key
        $table->timestamps();

        // Relationship
        $table->foreign('category_id')->references('category_id')->on('categories')->onDelete('cascade');
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
