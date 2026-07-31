<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;

class CategoryController extends Controller
{
    public function index()
    {
        // Database එකේ තියෙන සියලුම Categories Json දත්ත ලෙස ලබා දේ
        return response()->json(Category::all(), 200);
    }
}
