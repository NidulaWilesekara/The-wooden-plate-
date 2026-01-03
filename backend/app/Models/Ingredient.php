<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ingredient extends Model
{
    protected $fillable = [
        'name',
        'unit',
        'current_stock',
        'reorder_level',
        'supplier_name',
        'supplier_contact',
        'notes',
        'is_active',
    ];

    protected $casts = [
        'current_stock' => 'decimal:2',
        'reorder_level' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    // Relationships
    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class);
    }

    // Helper methods
    public function isLowStock()
    {
        return $this->current_stock <= $this->reorder_level;
    }

    public function updateStock($quantity, $type)
    {
        if ($type === 'IN') {
            $this->current_stock += $quantity;
        } else {
            $this->current_stock -= $quantity;
        }
        $this->save();
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeLowStock($query)
    {
        return $query->whereRaw('current_stock <= reorder_level');
    }
}
