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
    Schema::create('bookings', function (Blueprint $table) {

        $table->id();

        $table->foreignId('room_type_id')
    ->constrained()
    ->cascadeOnDelete();

$table->integer('quantity')->default(1);
        $table->string('booking_reference')
            ->unique();

        $table->string('guest_name');
        $table->string('guest_email');
        $table->string('guest_phone');

        $table->date('checkin_date');
        $table->date('checkout_date');

        $table->integer('adults');
        $table->integer('children')->default(0);

        $table->decimal('total_amount', 10, 2);

        $table->text('special_request')
            ->nullable();

        $table->enum('status', [
            'pending',
            'confirmed',
            'cancelled'
        ])->default('pending');

        $table->timestamps();
    });
}
};
