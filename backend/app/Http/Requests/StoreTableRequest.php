<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTableRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'table_number' => 'required|string|max:50|unique:tables,table_number',
            'chair_count' => 'required|integer|min:1|max:20',
            'is_active' => 'nullable|boolean',
            'notes' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'table_number.required' => 'Table number is required',
            'table_number.unique' => 'This table number already exists',
            'chair_count.required' => 'Chair count is required',
            'chair_count.min' => 'Table must have at least 1 chair',
            'chair_count.max' => 'Chair count cannot exceed 20',
        ];
    }
}
