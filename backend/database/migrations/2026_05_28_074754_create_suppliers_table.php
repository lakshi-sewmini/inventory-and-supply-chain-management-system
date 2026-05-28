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
        Schema::create('suppliers', function (Blueprint $table) {
        $table->string('supplier_id', 50)->primary();
        $table->string('supplier_name', 150);
        $table->string('contact_person', 100);
        $table->string('phone', 20);
        $table->string('email', 100);
        $table->text('address');
        $table->string('status', 20);
        $table->timestamps();
    });
       
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('suppliers');
    }
};
