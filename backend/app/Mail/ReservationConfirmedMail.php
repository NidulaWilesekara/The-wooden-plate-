<?php

namespace App\Mail;

use App\Models\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ReservationConfirmedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $reservation;
    public $customerName;
    public $tableName;
    public $date;
    public $time;
    public $duration;
    public $partySize;

    public function __construct(Reservation $reservation)
    {
        $this->reservation = $reservation;
        $this->customerName = $reservation->customer->name ?? 'Valued Guest';
        $this->tableName = 'Table ' . $reservation->table->table_number;
        $this->date = \Carbon\Carbon::parse($reservation->reservation_date)->format('l, F j, Y');
        $this->time = \Carbon\Carbon::parse($reservation->start_time)->format('g:i A');

        $start = \Carbon\Carbon::parse($reservation->start_time);
        $end = \Carbon\Carbon::parse($reservation->end_time);
        $this->duration = $start->diffInHours($end) . ' hour(s)';

        $this->partySize = $reservation->party_size;
    }

    public function build()
    {
        return $this->subject("Reservation Confirmed - The Wooden Plate")
            ->view('emails.reservation-confirmed');
    }
}
