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
        Schema::create('stock_transactions', function (Blueprint $table) {
        $table->string('transaction_id', 50)->primary();
        $table->string('batch_no', 50);
        $table->integer('quantity');
        $table->decimal('unit_cost', 10, 2);
        $table->decimal('total_cost', 12, 2);
        $table->dateTime('date');
        $table->string('status', 20);
        $table->unsignedBigInteger('user_id'); // Foreign Key to default users id
        $table->string('product_code', 50); // Foreign Key
        $table->timestamps();

        // Relationships
        $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        $table->foreign('product_code')->references('product_code')->on('products')->onDelete('cascade');
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_tansaction');
    }
};
