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
    Schema::create('booking_activity_logs', function (Blueprint $table) {
        $table->id();

        $table->foreignId('booking_id')
            ->constrained()
            ->cascadeOnDelete();

        $table->foreignId('user_id')
            ->nullable()
            ->constrained()
            ->nullOnDelete();

        $table->string('action');

        $table->text('description')->nullable();

        $table->timestamps();
    });
}

public function down(): void
{
    Schema::dropIfExists('booking_activity_logs');
}
};
