<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockMovement extends Model
{
    protected $fillable = [
        'ingredient_id',
        'type',
        'quantity',
        'movement_date',
        'note',
    ];

    protected $casts = [
        'quantity' => 'decimal:2',
        'movement_date' => 'date',
    ];

    // Relationships
    public function ingredient()
    {
        return $this->belongsTo(Ingredient::class);
    }

    // Scopes
    public function scopeStockIn($query)
    {
        return $query->where('type', 'IN');
    }

    public function scopeStockOut($query)
    {
        return $query->where('type', 'OUT');
    }

    public function scopeForMonth($query, $year, $month)
    {
        return $query->whereYear('movement_date', $year)
                     ->whereMonth('movement_date', $month);
    }
}
