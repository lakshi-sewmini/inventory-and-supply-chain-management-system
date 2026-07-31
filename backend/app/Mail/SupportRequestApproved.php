<?php

namespace App\Mail;

use App\Models\SupportTicket;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SupportRequestApproved extends Mailable
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
            subject: 'Smart Inventory System - Account Created Successfully!',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.request_approved',
        );
    }
}