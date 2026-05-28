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
       Schema::create('supplier_products', function (Blueprint $table) {
    $table->string('supplier_id', 50);
    $table->string('product_code', 50);
    $table->date('supplied_date');
    $table->string('status', 20);
    $table->timestamps();

    // Composite Primary Key (ටේබල් දෙකේම keys එකතු වී හැදෙන ප්‍රධාන කී එක)
    $table->primary(['supplier_id', 'product_code']);

    // Relationships
    $table->foreign('supplier_id')->references('supplier_id')->on('suppliers')->onDelete('cascade');
    $table->foreign('product_code')->references('product_code')->on('products')->onDelete('cascade');
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('supplier_products');
    }
};
