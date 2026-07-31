<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    // Database එකට දාන්න අවසර දෙන Column ටික මෙතන ලියන්න ඕනේ
    protected $fillable = ['reorder_level', 'currency_code'];
}