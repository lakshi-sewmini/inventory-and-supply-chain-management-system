<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Setting;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class SettingController extends Controller
{
    
    // 3. පරිශීලකයාගේ පාස්වර්ඩ් එක වෙනස් කරන අලුත් ෆන්ක්ෂන් එක
    public function changePassword(Request $request)
    {
        // Inputs ටික වැලිඩේට් කරනවා
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|string|min:6|confirmed', // confirmed කියන්නේ new_password_confirmation එකක් UI එකෙන් එන්න ඕනේ
        ]);

        // දැනට ලොග් වෙලා ඉන්න යූසර්ව ගන්නවා
        $user = Auth::user();

        // 1. යූසර් ඇතුළත් කරපු පරණ පාස්වර්ඩ් එක ඩේටාබේස් එකේ තියෙන එකට සමානද බලනවා
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Current password does not match!'
            ], 422);
        }

        // 2. අලුත් පාස්වර්ඩ් එක Hash (bcrypt) කරලා සේව් කරනවා
        $user->password = Hash::make($request->new_password);
        $user->save(); // 👈 මේකෙන් තමයි ඩේටාබේස් එකට ඇත්තටම සේව් වෙන්නේ

        return response()->json([
            'message' => 'Password updated successfully!'
        ]);
    }

    // 1. දැනට ඩේටාබේස් එකේ තියෙන සෙටින්ග්ස් රිඇක්ට් එකට යවන ෆන්ක්ෂන් එක
    public function getSettings()
    {
        // ඩේටාබේස් එකේ තියෙන පළවෙනි පේළිය ගන්නවා
        $setting = Setting::first();

        // ටේබල් එක හිස් නම් (මුල්ම වතාව නම්) default අගයන් ටිකක් රිඇක්ට් එකට යවනවා
        if (!$setting) {
            return response()->json([
                'reorder_level' => 10,
                'currency_code' => 'LKR (Rs.)'
            ]);
        }

        return response()->json($setting);
    }

    // 2. රිඇක්ට් එකෙන් එවන අලුත් සෙටින්ග්ස් ඩේටාබේස් එකට සේව් කරන ෆන්ක්ෂන් එක
    public function updateSettings(Request $request)
    {
        $request->validate([
            'reorder_level' => 'required|integer|min:0',
            'currency_code' => 'required|string',
        ]);

        // ID එක 1 වෙනි පේළිය විතරක් හැමදාම අප්ඩේට් කරන්න (updateOrCreate පාවිච්චි කරන්නේ ඒකයි)
        $setting = Setting::updateOrCreate(
            ['id' => 1],
            [
                'reorder_level' => $request->reorder_level,
                'currency_code' => $request->currency_code,
            ]
        );

        return response()->json([
            'message' => 'Settings saved successfully!',
            'data' => $setting
        ]);
    }
}