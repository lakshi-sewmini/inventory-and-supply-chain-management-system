import React, { useState } from 'react';
import API from '../api';

const InventoryView = () => {
  const [formData, setFormData] = useState({ product_code: '', quantity: '', unit_cost: '', batch_no: '', status: 'Stock In' });

  const handleTransaction = async (e) => {
    e.preventDefault();
    try {
      await API.post('/inventory/transaction', formData);
      alert(`${formData.status} updated successfully!`);
      setFormData({ product_code: '', quantity: '', unit_cost: '', batch_no: '', status: 'Stock In' });
    } catch (err) { alert("Transaction failed! Check product code."); }
  };

  return (
    <div className="p-8 max-w-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-700">Stock In / Stock Out Ledger</h2>
      <form onSubmit={handleTransaction} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Transaction Type</label>
          <select className="w-full p-2 border rounded" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
            <option value="Stock In">Stock In (+)</option>
            <option value="Stock Out">Stock Out (-)</option>
          </select>
        </div>
        <input type="text" value={formData.product_code} placeholder="Product Code" className="w-full p-2 border rounded" onChange={e => setFormData({...formData, product_code: e.target.value})} required />
        <input type="number" value={formData.quantity} placeholder="Quantity" className="w-full p-2 border rounded" onChange={e => setFormData({...formData, quantity: e.target.value})} required />
        <input type="number" value={formData.unit_cost} placeholder="Unit Cost / Price" className="w-full p-2 border rounded" onChange={e => setFormData({...formData, unit_cost: e.target.value})} required />
        <input type="text" value={formData.batch_no} placeholder="Batch No" className="w-full p-2 border rounded" onChange={e => setFormData({...formData, batch_no: e.target.value})} required />
        <button type="submit" className="w-full py-2 bg-[#149393] text-white font-bold rounded hover:bg-[#107575] uppercase tracking-wider">
          Submit Transaction
        </button>
      </form>
    </div>
  );
};

export default InventoryView;