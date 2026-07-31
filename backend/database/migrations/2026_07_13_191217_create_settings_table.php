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
    Schema::create('settings', function (Blueprint $table) {
        $table->id();
        // Default Reorder Level එක ඉලක්කමක් විදිහට සේව් කරන්න (Default = 10)
        $table->integer('reorder_level')->default(10);
        // Currency එක සේව් කරන්න (Default = LKR)
        $table->string('currency_code')->default('LKR (Rs.)');
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
