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
       Schema::create('purchase_orders', function (Blueprint $table) {
        $table->string('po_number', 50)->primary(); 
        $table->date('order_date');
        $table->date('expected_date');
        $table->decimal('total_amount', 12, 2);
        $table->decimal('tax', 10, 2);
        $table->string('status', 20);
        $table->string('supplier_id', 50); // Foreign Key to suppliers
        $table->unsignedBigInteger('user_id'); // Foreign Key to default users id (BigInteger)
        $table->timestamps();

        // Relationships
        $table->foreign('supplier_id')->references('supplier_id')->on('suppliers')->onDelete('cascade');
        $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
    });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_orders');
    }
};
