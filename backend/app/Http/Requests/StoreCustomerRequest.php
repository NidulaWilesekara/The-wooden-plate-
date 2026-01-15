<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCustomerRequest extends FormRequest
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
        'name' => 'required|string|max:255',

        'email' => [
            'required',
            'email',
            'unique:customers,email',
            'regex:/^[a-zA-Z0-9._%+-]+@gmail\.com$/'
        ],

        'phone' => [
            'required',
            'string',
            'unique:customers,phone',
            'regex:/^(?:\+94|0)7\d{8}$/'
        ],

        'address' => 'nullable|string|max:500',
    ];
  }


   public function messages(): array
  {
    return [
        'email.required' => 'Email is required.',
        'email.email'    => 'Please enter a valid email address.',
        'email.unique'   => 'This email is already used.',
        'email.regex'    => 'Only Gmail addresses (@gmail.com) are allowed.',

        'phone.unique'   => 'This phone number is already used.',
        'phone.regex'    => 'Phone number must be like 07XXXXXXXX or +947XXXXXXXX.',
    ];
   }

}
