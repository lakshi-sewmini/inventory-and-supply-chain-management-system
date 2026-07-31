<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens,HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
            'user_id' ,
            'first_name' ,
            'last_name',
            'name',
            'email',
            'username', 
            'role' ,
            'status' ,
            'password' 
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function purchaseorders()
    {
          return $this->hasMany(PurchaseOrder::class, 'user_id', 'id');
    }

    public function stockTransactions()
    {
    return $this->hasMany(StockTransaction::class, 'user_id', 'id');
    }

    protected $primaryKey = 'user_id';
    public $incrementing = false; // user_id එක auto-increment (1, 2, 3...) නොවන නිසා
    protected $keyType = 'string'; // user_id එක string (U001) නිසා
}
