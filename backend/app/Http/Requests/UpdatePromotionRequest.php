<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePromotionRequest extends FormRequest
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
        $promotionId = $this->route('promotion'); // if Route Model Binding {promotion}
        // If you use {id} then: $promotionId = $this->route('id');

        return [
            'title'       => 'sometimes|required|string|max:255',
            'type'        => 'sometimes|required|in:percentage,fixed',
            'value'       => 'sometimes|required|numeric|min:0',

            'starts_at'   => 'nullable|date',
            'ends_at'     => 'nullable|date|after_or_equal:starts_at',

            'is_active'   => 'nullable|boolean',
            'description' => 'nullable|string',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $type = $this->input('type');
            $value = $this->has('value') ? (float) $this->input('value') : null;

            if ($type === 'percentage' && $value !== null && $value > 100) {
                $validator->errors()->add('value', 'Percentage value cannot be greater than 100.');
            }
        });
    }
}
