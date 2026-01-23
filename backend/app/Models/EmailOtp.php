<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmailOtp extends Model
{
    protected $fillable = [
        'customer_id',
        'otp_hash',
        'expires_at',
        'attempts',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * Check if OTP is expired
     */
    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    /**
     * Check if max attempts exceeded
     */
    public function hasExceededAttempts(int $maxAttempts = 5): bool
    {
        return $this->attempts >= $maxAttempts;
    }

    /**
     * Increment attempts
     */
    public function incrementAttempts(): void
    {
        $this->increment('attempts');
    }
}
