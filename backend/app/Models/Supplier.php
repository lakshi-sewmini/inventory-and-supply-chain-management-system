<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Supplier extends Model

    {
    protected $primaryKey = 'supplier_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'supplier_id', 'supplier_name', 'contact_person', 'phone', 'email', 'address', 'status'
    ];

    public function purchaseOrders()
    {
        return $this->hasMany(PurchaseOrder::class, 'supplier_id', 'supplier_id');
    }

    public function products()
    {
          // to get the list of products provided by the supplier
    return $this->belongsToMany(Products::class, 'supplier_products', 'supplier_id', 'product_code')
                ->withPivot('supplied_date', 'status') // additional fields in the pivot table
                ->withTimestamps();
    }
}
