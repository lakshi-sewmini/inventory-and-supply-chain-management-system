import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PurchaseView = () => {
  const [showForm, setShowForm] = useState(false);
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({ po_number: '', order_date: '2026-05-20', expected_date: '', tax: 0, supplier_id: '', items: [{ product_code: '', quantity: 1, unit_price: 0 }] });

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/purchase-orders`, { headers: { Authorization: `Bearer ${token}` } });
      setOrders(res.data);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen text-gray-800">
      {!showForm ? (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Purchase Orders</h2>
            </div>
            <button onClick={() => setShowForm(true)} className="bg-[#2563eb] hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-sm">+ Create Purchase Order</button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-100">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="p-4"># PO Number</th>
                  <th className="p-4">Supplier</th>
                  <th className="p-4">Order Date</th>
                  <th className="p-4">Total Amount (Rs.)</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.length === 0 ? (
                  <tr><td colSpan="5" className="p-4 text-center text-slate-400 bg-white">No active Purchase Orders found</td></tr>
                ) : (
                  orders.map((o, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-bold text-slate-700">{o.po_number}</td>
                      <td className="p-4 text-slate-600">{o.supplier_id}</td>
                      <td className="p-4 text-slate-500">{o.order_date}</td>
                      <td className="p-4 font-semibold text-slate-700">Rs. {o.total_amount}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-600">Pending</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Create Purchase Order Form - Photo 13 */
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 max-w-4xl mx-auto">
          <div className="border-b border-slate-100 pb-4 mb-6">
            <h2 className="text-lg font-bold text-slate-800">Create Purchase Order</h2>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="flex flex-col space-y-1.5"><label className="text-xs font-semibold text-slate-500">Supplier</label><select className="border border-slate-200 rounded-lg p-2.5 text-sm bg-white"><option>Select Supplier</option></select></div>
            <div className="flex flex-col space-y-1.5"><label className="text-xs font-semibold text-slate-500">Order Date</label><input type="date" value={formData.order_date} className="border border-slate-200 rounded-lg p-2.5 text-sm bg-white" /></div>
            <div className="flex flex-col space-y-1.5"><label className="text-xs font-semibold text-slate-500">Expected Date</label><input type="date" className="border border-slate-200 rounded-lg p-2.5 text-sm bg-white" /></div>
          </div>
          <div className="flex justify-end space-x-3 border-t border-slate-100 pt-4">
            <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-500 hover:bg-slate-50">Cancel</button>
            <button type="button" onClick={() => {alert('Order Placed!'); setShowForm(false);}} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm">Save Order</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseView;