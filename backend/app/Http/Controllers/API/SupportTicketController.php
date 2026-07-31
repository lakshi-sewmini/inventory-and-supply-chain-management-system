<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\SupportTicket;
use App\Models\User; 
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\SupportRequestRejected;
use App\Mail\SupportRequestApproved;
use App\Mail\PasswordResetApproved;

class SupportTicketController extends Controller
{
    // 1. User රික්වෙස්ට් එක සේව් කරන එක
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_email' => 'required|email',
            'request_type' => 'required|string',
            'message' => 'required|string',
        ]);

        // Corporate Domain Whitelisting (Optional Security)
        $allowed_domain = "smartinv.com";
        $email_parts = explode("@", $request->user_email);
        if ($email_parts[1] !== $allowed_domain) {
            return response()->json(['message' => 'Only corporate emails are allowed!'], 403);
        }

        $ticket = SupportTicket::create($validated);

        return response()->json(['success' => true, 'message' => 'Request submitted successfully!', 'data' => $ticket], 201);
    }

    // 2. Admin Dashboard එකට ඔක්කොම ටික ගන්න එක (Pending ඒවා මුලට)
    public function index()
    {
        $tickets = SupportTicket::orderByRaw("FIELD(status, 'Pending', 'Approved', 'Rejected')")
                                ->orderBy('id', 'desc')
                                ->get();
        return response()->json($tickets);
    }

    // 3. Request එක Approve කිරීම 
    public function approve($id)
    {
        $ticket = SupportTicket::findOrFail($id);

        // --- 🔵 බාල්දිය 1: Account Creation ---
        if ($ticket->request_type === 'Account Creation') {
            $temporaryPassword = Str::random(10); 

            $latestUser = User::latest('id')->first();
            $nextId = $latestUser ? ($latestUser->id + 1) : 1;
            $generatedUserId = 'USR' . str_pad($nextId, 4, '0', STR_PAD_LEFT); 

            User::create([
                'user_id'  => $generatedUserId, 
                'name'     => explode('@', $ticket->user_email)[0], 
                'email'    => $ticket->user_email,
                'password' => Hash::make($temporaryPassword),
                'role'     => 'Staff', 
            ]);

            $ticket->status = 'Approved';
            $ticket->save();

            try {
                Mail::to($ticket->user_email)->send(new SupportRequestApproved($ticket, $temporaryPassword));
            } catch (\Exception $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'Account created, but email failed to send: ' . $e->getMessage(),
                    'temporary_password' => $temporaryPassword
                ], 500);
            }

            return response()->json([
                'success' => true,
                'message' => 'Account created and credentials emailed successfully!',
                'temporary_password' => $temporaryPassword 
            ]);
        }

        // --- 🟢 බාල්දිය 2: Password Reset (මෙන්න මෙතනයි අලුත් කොටස) ---
        if ($ticket->request_type === 'Password Reset') {
            // ඩේටාබේස් එකේ දැනට ඉන්න සැබෑ යූසර්ව හොයාගන්නවා
            $user = User::where('email', $ticket->user_email)->first();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User with this email does not exist in the system!'
                ], 404);
            }

            // තාවකාලික පාස්වර්ඩ් එකක් හදලා Encrypt කරලා සේව් කරනවා
            $temporaryPassword = Str::random(10); 
            $user->password = Hash::make($temporaryPassword);
            $user->save();

            // ටිකට් එක Approved කරනවා
            $ticket->status = 'Approved';
            $ticket->save();

            // ✉️ Password Reset Approved ඊමේල් එක Automatically යැවීම
            try {
                Mail::to($ticket->user_email)->send(new PasswordResetApproved($ticket, $temporaryPassword));
            } catch (\Exception $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'Password updated, but email failed to send: ' . $e->getMessage(),
                    'temporary_password' => $temporaryPassword
                ], 500);
            }

            return response()->json([
                'success' => true,
                'message' => 'Password reset successfully and new credentials emailed!',
                'temporary_password' => $temporaryPassword
            ]);
        }

        // --- 🟡 බාල්දිය 3: වෙනත් ඕනෑම Request එකක් නම් (General Requests) ---
        $ticket->status = 'Approved';
        $ticket->save();

        return response()->json(['success' => true, 'message' => 'Request approved successfully!']);
    }

    // 4. Request එක Reject කිරීම (+ ✉️ Email එකක් යැවීම)
    public function reject($id)
    {
        $ticket = SupportTicket::findOrFail($id);
        
        $ticket->status = 'Rejected';
        $ticket->save();

        try {
            Mail::to($ticket->user_email)->send(new SupportRequestRejected($ticket));
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Request rejected, but email failed to send: ' . $e->getMessage()
            ], 500);
        }

        return response()->json(['success' => true, 'message' => 'Request rejected and notification email sent!']);
    }
}