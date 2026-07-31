<?php

namespace App\Mail;

use App\Models\SupportTicket;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PasswordResetApproved extends Mailable
{
    use Queueable, SerializesModels;

    public $ticket;
    public $temporaryPassword;

    public function __construct(SupportTicket $ticket, $temporaryPassword)
    {
        $this->ticket = $ticket;
        $this->temporaryPassword = $temporaryPassword;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Smart Inventory System - Password Reset Successful!',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.password_reset_approved', // next step Blade file name
        );
    }
}