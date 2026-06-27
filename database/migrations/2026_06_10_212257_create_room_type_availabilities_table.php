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
    Schema::create('room_type_availabilities', function (Blueprint $table) {
        $table->id();
        $table->foreignId('room_type_id')->constrained()->cascadeOnDelete();
        $table->date('date');
        $table->integer('blocked_rooms')->default(0);
        $table->string('reason')->nullable();
        $table->timestamps();

        $table->unique(['room_type_id', 'date']);
    });
}
};
