<?php

namespace App\Mail;

use App\Models\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ReservationCancelledMail extends Mailable
{
    use Queueable, SerializesModels;

    public $reservation;
    public $customerName;
    public $tableName;
    public $date;
    public $time;
    public $reason;

    public function __construct(Reservation $reservation, $reason = null)
    {
        $this->reservation = $reservation;
        $this->customerName = $reservation->customer->name ?? 'Valued Guest';
        $this->tableName = 'Table ' . $reservation->table->table_number;
        $this->date = \Carbon\Carbon::parse($reservation->reservation_date)->format('l, F j, Y');
        $this->time = \Carbon\Carbon::parse($reservation->start_time)->format('g:i A');
        $this->reason = $reason ?? $reservation->admin_notes;
    }

    public function build()
    {
        return $this->subject("Reservation Cancelled - The Wooden Plate")
            ->view('emails.reservation-cancelled');
    }
}
