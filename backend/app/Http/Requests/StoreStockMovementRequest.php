<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreStockMovementRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'ingredient_id' => 'required|exists:ingredients,id',
            'type' => 'required|in:IN,OUT',
            'quantity' => 'required|numeric|min:0.01',
            'movement_date' => 'required|date',
            'note' => 'nullable|string',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Check if OUT quantity exceeds current stock
            if ($this->type === 'OUT') {
                $ingredient = \App\Models\Ingredient::find($this->ingredient_id);
                if ($ingredient && $this->quantity > $ingredient->current_stock) {
                    $validator->errors()->add('quantity',
                        'Cannot remove more than current stock (' . $ingredient->current_stock . ' ' . $ingredient->unit . ')');
                }
            }
        });
    }
}
