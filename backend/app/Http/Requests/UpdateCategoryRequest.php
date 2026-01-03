<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|required|string|max:255',
            'image' => 'nullable|string|max:255',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer|min:0'
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Category name is required',
            'name.max' => 'Category name must not exceed 255 characters',
            'sort_order.min' => 'Sort order must be a positive number'
        ];
    }
}
