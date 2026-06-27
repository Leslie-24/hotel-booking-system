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
        $table->foreignId('room_unit_id')
            ->nullable()
            ->after('room_type_id')
            ->constrained()
            ->nullOnDelete();

        $table->enum('stay_status', [
            'not_checked_in',
            'checked_in',
            'checked_out'
        ])->default('not_checked_in')->after('status');

        $table->timestamp('checked_in_at')->nullable()->after('stay_status');
        $table->timestamp('checked_out_at')->nullable()->after('checked_in_at');
    });
}

public function down(): void
{
    Schema::table('bookings', function (Blueprint $table) {
        $table->dropForeign(['room_unit_id']);
        $table->dropColumn([
            'room_unit_id',
            'stay_status',
            'checked_in_at',
            'checked_out_at',
        ]);
    });
}
};
