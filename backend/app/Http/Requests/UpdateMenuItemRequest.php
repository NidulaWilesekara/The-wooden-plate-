<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMenuItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id' => 'sometimes|required|exists:categories,id',
            'name' => 'sometimes|required|string|max:255',
            'price' => 'sometimes|required|numeric|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'description' => 'nullable|string',
            'is_available' => 'sometimes|boolean',
            'is_popular' => 'sometimes|boolean'
        ];
    }

    protected function prepareForValidation()
    {
        $payload = [];

        if ($this->has('is_available')) {
            $payload['is_available'] = filter_var($this->is_available, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? false;
        }

        if ($this->has('is_popular')) {
            $payload['is_popular'] = filter_var($this->is_popular, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? false;
        }

        if (!empty($payload)) {
            $this->merge($payload);
        }
    }

    public function messages(): array
    {
        return [
            'category_id.required' => 'Category is required',
            'category_id.exists' => 'Selected category does not exist',
            'name.required' => 'Item name is required',
            'price.required' => 'Price is required',
            'price.min' => 'Price must be a positive number'
        ];
    }
}
