<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Table;

class StoreReservationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'table_id' => 'required|exists:tables,id',
            'party_size' => 'required|integer|min:1',
            'reservation_date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'customer_notes' => 'nullable|string|max:500',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Validate party size against table capacity
            if ($this->table_id && $this->party_size) {
                $table = Table::find($this->table_id);
                if ($table && $this->party_size > $table->chair_count) {
                    $validator->errors()->add(
                        'party_size',
                        "Party size ({$this->party_size}) exceeds table capacity ({$table->chair_count} chairs)"
                    );
                }
            }

            // Check for overlapping reservations
            if ($this->table_id && $this->reservation_date && $this->start_time && $this->end_time) {
                $table = Table::find($this->table_id);
                if ($table && !$table->isAvailable($this->reservation_date, $this->start_time, $this->end_time)) {
                    $validator->errors()->add(
                        'table_id',
                        'This table is not available for the selected time slot'
                    );
                }
            }
        });
    }

    public function messages(): array
    {
        return [
            'table_id.required' => 'Please select a table',
            'table_id.exists' => 'Selected table does not exist',
            'party_size.required' => 'Party size is required',
            'party_size.min' => 'Party size must be at least 1',
            'reservation_date.required' => 'Reservation date is required',
            'reservation_date.after_or_equal' => 'Reservation date cannot be in the past',
            'start_time.required' => 'Start time is required',
            'end_time.required' => 'End time is required',
            'end_time.after' => 'End time must be after start time',
        ];
    }
}
