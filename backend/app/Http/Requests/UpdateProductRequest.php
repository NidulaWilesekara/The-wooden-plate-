<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Admin authorization handled by middleware
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name'         => 'sometimes|required|string|max:255',
            'price'        => 'sometimes|required|numeric|min:0',
            'image'        => 'nullable|string|max:255',
            'description'  => 'nullable|string',
            'category'     => 'nullable|string|max:100',

            'is_available' => 'nullable|boolean',
            'is_featured'  => 'nullable|boolean',
            'is_new'       => 'nullable|boolean',
        ];
    }
}
