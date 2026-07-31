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
    Schema::create('support_tickets', function (Blueprint $table) {
        $table->id();
        $table->string('user_email');
        $table->string('request_type'); // 'Password Reset' හෝ 'Account Creation'
        $table->text('message');
        $table->string('status')->default('Pending'); // Pending / Resolved
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('support_tickets');
    }
};
