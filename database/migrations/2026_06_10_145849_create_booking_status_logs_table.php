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
    Schema::create('booking_status_logs', function (Blueprint $table) {

        $table->id();

        $table->foreignId('booking_id')
            ->constrained()
            ->cascadeOnDelete();

        $table->foreignId('user_id')
            ->nullable()
            ->constrained()
            ->nullOnDelete();

        $table->string('old_status');
        $table->string('new_status');

        $table->text('note')->nullable();

        $table->timestamps();
    });
}
};
