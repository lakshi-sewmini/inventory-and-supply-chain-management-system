<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $primaryKey = 'product_code';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'product_code', 'product_name', 'brand', 'unit_price', 'status', 'category_id'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id', 'category_id');
    }

    public function orderItems()
    {
        return $this->hasMany(PurchaseOrderItem::class, 'product_code', 'product_code');
    }

    public function stockTransactions()
    {
        return $this->hasMany(StockTransaction::class, 'product_code', 'product_code');
    }
      // to get a list of suppliers  who provide the goods
    public function suppliers()
    {
    return $this->belongsToMany(Supplier::class, 'supplier_products', 'product_code', 'supplier_id')
                ->withPivot('supplied_date', 'status')
                ->withTimestamps();
    }
}
