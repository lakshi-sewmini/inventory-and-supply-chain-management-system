<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin User
        User::create([
            'first_name' => 'Admin',
            'last_name' => 'User',
            'name' => 'Administrator',
            'email' => 'admin@gmail.com',
            'role' => 'Admin',
            'status' => 'Active',
            'password' => Hash::make('password123'),
        ]);
   
        // Manager User
        User::create([
            'first_name' => 'Manager',
            'last_name' => 'User',
            'name' => 'Manager',
            'email' => 'manager@gmail.com',
            'role' => 'Manager',
            'status' => 'Active',
            'password' => Hash::make('password124'),
        ]);

        // Supplier User
        User::create([
            'first_name' => 'Supplier',
            'last_name' => 'User',
            'name' => 'Supplier',
            'email' => 'supplier@gmail.com',
            'role' => 'Supplier', // මෙතන කලින් Manager තිබුනේ, Supplier ලෙස හැදුවා
            'status' => 'Active',
            'password' => Hash::make('password125'),
        ]);
    }
}