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
        Schema::create('email_otps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained('customers')->onDelete('cascade');
            $table->string('otp_hash'); // Store hashed OTP, not plain
            $table->timestamp('expires_at');
            $table->unsignedTinyInteger('attempts')->default(0); // Max attempts tracking
            $table->timestamps();

            // Index for faster lookups
            $table->index(['customer_id', 'expires_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('email_otps');
    }
};
