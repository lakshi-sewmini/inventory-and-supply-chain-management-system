<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseOrder extends Model
{
     protected $primaryKey = 'po_number';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'po_number', 'order_date', 'expected_date', 'total_amount', 'tax', 'status', 'supplier_id', 'user_id'
    ];

    public function supplier()
    {
        return $this->belongsTo(Supplier::class, 'supplier_id', 'supplier_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function items()
    {
        return $this->hasMany(PurchaseOrderItem::class, 'po_number', 'po_number');
    }
}

