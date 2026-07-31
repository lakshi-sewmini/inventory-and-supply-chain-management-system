<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::table('purchase_orders', function (Blueprint $table) {
        // Secure Token එකක් සේව් කරන්න unique string field එකක් දානවා
        $table->string('magic_token', 80)->nullable()->unique()->after('status');
    });
}

public function down()
{
    Schema::table('purchase_orders', function (Blueprint $table) {
        $table->dropColumn('magic_token');
    });
}
};
