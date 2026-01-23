<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OtpMail extends Mailable
{
    use Queueable, SerializesModels;

    public $otp;
    public $name;
    public $expires;
    public $verifyUrl;
    public $logoUrl;

    public function __construct($otp, $name = null, $expires = 5, $verifyUrl = null, $logoUrl = null)
    {
        $this->otp = $otp;
        $this->name = $name;
        $this->expires = $expires;
        $this->verifyUrl = $verifyUrl;
        $this->logoUrl = $logoUrl;
    }

    public function build()
    {
        return $this->subject("Your OTP Code - The Wooden Plate")
            ->view('emails.otp');
    }
}
