<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseOrder extends Model
{
     protected $primaryKey = 'po_number';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'po_number', 'order_date', 'expected_date', 'total_amount', 'tax', 'status', 'supplier_id', 'user_id','magic_token'
    ];

    public function supplier()
    {
        return $this->belongsTo(Supplier::class, 'supplier_id', 'supplier_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    // app/Models/PurchaseOrder.php

public function items()
{
    // foreign_key = 'po_number', local_key = 'po_number'
    return $this->hasMany(PurchaseOrderItem::class, 'po_number', 'po_number');
}
}

