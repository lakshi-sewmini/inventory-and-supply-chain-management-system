<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // සියලුම Users පෙන්වීමට
    public function index()
    {
        return response()->json(User::all());
    }

    // අලුතින් User කෙනෙක් එකතු කිරීමට (Register)
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|string|unique:users,user_id',
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'role' => 'required'
        ]);

        $user = User::create([
            'user_id' => $request->user_id, // user_id එක database එකට save කිරීම
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password), // Password එක Hash කිරීම
            'role' => $request->role,
            'status' => $request->status ?? 'Active',
        ]);

        return response()->json(['message' => 'User created successfully', 'user' => $user], 201);
    }

    // User කෙනෙක් Update කිරීමට (id වෙනුවට user_id භාවිතා කිරීම)
    public function update(Request $request, $user_id)
    {
        // Primary key එක (`id`) වෙනුවට `user_id` මඟින් අදාළ user ව සොයා ගැනීම
        $user = User::where('user_id', $user_id)->firstOrFail();

        $request->validate([
            'user_id' => 'required|string|unique:users,user_id,' . $user->id,
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users,email,' . $user->id,
            'role' => 'required'
        ]);

        $user->user_id = $request->user_id;
        $user->name = $request->name;
        $user->email = $request->email;
        $user->role = $request->role;
        $user->status = $request->status;

        // Password එකක් අලුතින් ලබා දී ඇත්නම් පමණක් Hash කර Update කරන්න
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return response()->json(['message' => 'User updated successfully', 'user' => $user]);
    }

    // User කෙනෙක් Delete කිරීමට
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }
}