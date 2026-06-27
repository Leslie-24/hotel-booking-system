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
    Schema::create('room_units', function (Blueprint $table) {
        $table->id();

        $table->foreignId('room_type_id')
            ->constrained()
            ->cascadeOnDelete();

        $table->string('room_number');

        $table->enum('status', [
            'active',
            'inactive',
            'maintenance'
        ])->default('active');

        $table->timestamps();

        $table->unique(['room_type_id', 'room_number']);
    });
}
};
