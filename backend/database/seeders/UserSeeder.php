<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'user_id' => 'USR001',
            'first_name' => 'Admin',
            'last_name' => 'User',
            'name' => 'Administrator',
            'email' => 'admin@gmail.com',
            'name' => 'admin', // login - username
            'role' => 'Admin',
            'status' => 'Active',
            'password' => Hash::make('password123'), //  login - password
        ]);
    }
}
 
