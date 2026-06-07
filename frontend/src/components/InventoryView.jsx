import React, { useState } from 'react';
import axios from 'axios';

const InventoryView = () => {
  const [status, setStatus] = useState('Stock In'); // Stock In or Stock Out
  const [formData, setFormData] = useState({ transaction_id: '', date: '2026-05-20', supplier: '', items: [{ product_code: '', batch_no: '', quantity: 0, unit_cost: 0 }] });

  const handleAddItemRow = () => {
    setFormData({ ...formData, items: [...formData.items, { product_code: '', batch_no: '', quantity: 0, unit_cost: 0 }] });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;
    setFormData({ ...formData, items: updatedItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      // එකින් එක ලොග් කරන විදිහට ඔයාගේ API එකට මැප් කරනවා
      for (let item of formData.items) {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/inventory/transaction`, {
          transaction_id: formData.transaction_id,
          product_code: item.product_code,
          batch_no: item.batch_no,
          quantity: item.quantity,
          unit_cost: item.unit_cost,
          status: status
        }, { headers: { Authorization: `Bearer ${token}` } });
      }
      alert(`${status} Transaction logged successfully!`);
    } catch (err) { alert('Transaction failed'); }
  };

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen text-gray-800">
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
          <h2 className="text-lg font-bold text-slate-800">{status}</h2>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button type="button" onClick={() => setStatus('Stock In')} className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${status === 'Stock In' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>Stock In</button>
            <button type="button" onClick={() => setStatus('Stock Out')} className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${status === 'Stock Out' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>Stock Out</button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">Reference No.</label>
              <input type="text" placeholder="e.g. TRN-001" required onChange={e => setFormData({...formData, transaction_id: e.target.value})} className="border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">Date</label>
              <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500 bg-white" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">{status === 'Stock In' ? 'Supplier' : 'To (Department/Customer)'}</label>
              <input type="text" placeholder="Enter destination/source" className="border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-700 mb-3">Add Items</h3>
            <table className="w-full text-left border-collapse text-sm border border-slate-100 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold text-xs uppercase">
                  <th className="p-3"># Product</th>
                  <th className="p-3">Batch No.</th>
                  <th className="p-3">Qty</th>
                  <th className="p-3">Unit Cost (Rs.)</th>
                  <th className="p-3">Total (Rs.)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {formData.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-2"><input type="text" placeholder="Product Code" required onChange={e => handleItemChange(idx, 'product_code', e.target.value)} className="w-full border border-slate-200 rounded-md p-1.5 text-xs outline-none" /></td>
                    <td className="p-2"><input type="text" placeholder="Batch No" required onChange={e => handleItemChange(idx, 'batch_no', e.target.value)} className="w-full border border-slate-200 rounded-md p-1.5 text-xs outline-none" /></td>
                    <td className="p-2"><input type="number" placeholder="0" required onChange={e => handleItemChange(idx, 'quantity', parseInt(e.target.value) || 0)} className="w-full border border-slate-200 rounded-md p-1.5 text-xs outline-none" /></td>
                    <td className="p-2"><input type="number" placeholder="0.00" required onChange={e => handleItemChange(idx, 'unit_cost', parseFloat(e.target.value) || 0)} className="w-full border border-slate-200 rounded-md p-1.5 text-xs outline-none" /></td>
                    <td className="p-3 text-slate-600 font-medium text-xs">{(item.quantity * item.unit_cost).toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type="button" onClick={handleAddItemRow} className="mt-3 text-xs font-bold text-blue-600 hover:text-blue-700">+ Add Row</button>
          </div>

          <div className="flex justify-end space-x-3 border-t border-slate-100 pt-4">
            <button type="button" className="px-5 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-500 hover:bg-slate-50">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm">Save {status}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryView;