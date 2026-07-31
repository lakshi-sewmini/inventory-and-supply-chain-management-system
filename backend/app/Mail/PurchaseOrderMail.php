<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PurchaseOrderMail extends Mailable
{
    use Queueable, SerializesModels;

    public $purchaseOrder;
    protected $pdfPath;

    // Purchase Order දත්ත සහ PDF එකේ path එක constructor එකට ගන්නවා
    public function __construct($purchaseOrder, $pdfPath = null)
    {
        $this->purchaseOrder = $purchaseOrder;
        $this->pdfPath = $pdfPath;
    }

    public function build()
    {
        $email = $this->subject('New Purchase Order - ' . $this->purchaseOrder->po_number)
                      ->view('emails.purchase_order'); // අපි ඊළඟට හදන Blade file එක

        // PDF එකක් තියෙනවා නම් ඒක attach කරනවා
        if ($this->pdfPath && file_exists($this->pdfPath)) {
            $email->attach($this->pdfPath, [
                'as' => $this->purchaseOrder->po_number . '.pdf',
                'mime' => 'application/pdf',
            ]);
        }

        return $email;
    }
}