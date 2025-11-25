<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run()
    {
        User::updateOrCreate(
            ['email' => 'chamudi@gmail.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('poppy75123'), // hardcoded password
                'is_admin' => true,
            ]
        );
    }
}