<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SupplierController extends Controller
{
    public function index()
    {
        return response()->json(Supplier::all(), 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'supplier_id' => 'required|string|unique:suppliers,supplier_id',
            'name' => 'required|string|max:255',
            'contact_person' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'address' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $supplier = Supplier::create([
            'supplier_id' => $request->supplier_id,
            'supplier_name' => $request->name, 
            'contact_person' => $request->contact_person,
            'phone' => $request->phone,
            'email' => $request->email,
            'address' => $request->address,
            'status' => $request->status ?? 'Active',
        ]);

        return response()->json(['message' => 'Supplier saved successfully!', 'supplier' => $supplier], 201);
    }

    public function update(Request $request, $supplier_id)
    {
        $supplier = Supplier::findOrFail($supplier_id);
        $supplier->update([
            'supplier_id' => $request->supplier_id,
            'supplier_name' => $request->name,
            'contact_person' => $request->contact_person,
            'phone' => $request->phone,
            'email' => $request->email,
            'address' => $request->address,
            'status' => $request->status ?? 'Active',
        ]);
        return response()->json(['message' => 'Updated successfully']);
    }

    public function destroy($supplier_id)
    {
        Supplier::findOrFail($supplier_id)->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}