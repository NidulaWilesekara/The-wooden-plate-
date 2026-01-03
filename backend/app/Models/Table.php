<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Table extends Model
{
    use HasFactory;

    protected $fillable = [
        'table_number',
        'chair_count',
        'is_active',
        'notes',
    ];

    protected $casts = [
        'chair_count' => 'integer',
        'is_active' => 'boolean',
    ];

    /**
     * Get all reservations for this table
     */
    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }

    /**
     * Check if table is available for a specific date and time range
     */
    public function isAvailable($date, $startTime, $endTime): bool
    {
        if (!$this->is_active) {
            return false;
        }

        // Check for overlapping reservations that are not cancelled
        $overlapping = $this->reservations()
            ->where('reservation_date', $date)
            ->whereIn('status', ['pending', 'confirmed'])
            ->where(function ($query) use ($startTime, $endTime) {
                $query->whereBetween('start_time', [$startTime, $endTime])
                    ->orWhereBetween('end_time', [$startTime, $endTime])
                    ->orWhere(function ($q) use ($startTime, $endTime) {
                        $q->where('start_time', '<=', $startTime)
                          ->where('end_time', '>=', $endTime);
                    });
            })
            ->exists();

        return !$overlapping;
    }

    /**
     * Scope for active tables
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
