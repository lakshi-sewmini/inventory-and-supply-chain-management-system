<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('name', $request->name)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'The information entered is incorrect!'], 401);
        }

        // creating and providing a token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Sucessfully logged into the system!',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'role' => $user->role
        ], 200);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Succesfully removed from te system!']);
    }
}
