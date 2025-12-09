<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Details extends Model
{
     protected $fillable = [
        'name',
        'contact_email',
        'contact_phone',
        'address',
        'opening_hours',
        'facebook_url',
        'instagram_url',
        'twitter_url',
        'tiktok_url',
    ];
}
