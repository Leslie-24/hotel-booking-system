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
    Schema::create('rooms', function (Blueprint $table) {
        $table->id();

        $table->string('room_number')->unique();
        $table->string('room_type');

        $table->text('description')->nullable();
        $table->text('amenities')->nullable();

        $table->decimal('price_per_night', 10, 2);

        $table->integer('max_adults')->default(2);
        $table->integer('max_children')->default(0);

        $table->enum('status', [
            'active',
            'inactive',
            'maintenance'
        ])->default('active');

        $table->timestamps();
    });
}
};
