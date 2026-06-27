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
    Schema::table('bookings', function (Blueprint $table) {
        $table->enum('payment_status', [
            'pending',
            'partially_paid',
            'paid',
            'refunded'
        ])->default('pending')->after('total_amount');

        $table->decimal('amount_paid', 10, 2)->default(0)->after('payment_status');
    });
}

public function down(): void
{
    Schema::table('bookings', function (Blueprint $table) {
        $table->dropColumn(['payment_status', 'amount_paid']);
    });
}
};
