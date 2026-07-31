import React, { useState, useEffect } from 'react';
import axios from 'axios';

// props එකක් විදිහට token එක App.jsx එකෙන් දෙනවා
const PublicPOTracking = ({ token }) => {
  const [po, setPo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (token) {
      fetchPublicOrder();
    }
  }, [token]);

  const fetchPublicOrder = async () => {
    try {
      // ⚠️ මේක පබ්ලික් API එකක් නිසා Auth headers යවන්නේ නැහැ
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/public/po-tracking/${token}`);
      setPo(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'This tracking link is invalid or has expired.');
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    const confirmChange = window.confirm(`Are you sure you want to update this order status to "${newStatus}"?`);
    if (!confirmChange) return;

    setUpdating(true);
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/public/po-tracking/${token}`, {
        status: newStatus
      });
      alert(res.data.message || 'Status updated successfully!');
      fetchPublicOrder();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <p className="text-slate-500 font-medium">Loading purchase order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100 max-w-md text-center">
          <div className="text-red-500 text-3xl mb-2">⚠️</div>
          <h2 className="text-lg font-bold text-slate-800 mb-1">Access Denied</h2>
          <p className="text-slate-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 text-slate-800 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-blue-600 p-6 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider bg-blue-700 px-2 py-1 rounded">Supplier Portal</span>
            <h1 className="text-xl font-bold mt-1">Purchase Order #{po.po_number}</h1>
          </div>
          <div className="text-sm bg-blue-700/50 px-3 py-2 rounded border border-blue-500/30">
            Status: <span className="font-bold uppercase tracking-wider">{po.status}</span>
          </div>
        </div>

        <div className="p-6">
          {/* Actions */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="font-bold text-slate-700 text-sm">Supplier Actions Required</h3>
              <p className="text-xs text-slate-500 mt-0.5">Confirm receipt or update status once items are shipped.</p>
            </div>
            <div className="flex gap-2">
              <button
                disabled={updating || po.status === 'Confirmed' || po.status === 'Shipped'}
                onClick={() => handleStatusUpdate('Confirmed')}
                className={`px-4 py-2 rounded text-xs font-bold transition-all shadow-sm ${
                  po.status === 'Confirmed' 
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {po.status === 'Confirmed' ? '✓ Order Confirmed' : 'Confirm Order'}
              </button>
              
              <button
                disabled={updating || po.status === 'Shipped'}
                onClick={() => handleStatusUpdate('Shipped')}
                className={`px-4 py-2 rounded text-xs font-bold transition-all shadow-sm ${
                  po.status === 'Shipped'
                    ? 'bg-blue-100 text-blue-700 border border-blue-200 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {po.status === 'Shipped' ? '✓ Shipped' : 'Mark as Shipped'}
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-slate-100 pb-6 mb-6">
            <div>
              <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-2">Order Dates</h4>
              <p className="text-sm"><strong>Order Date:</strong> {po.order_date}</p>
              <p className="text-sm mt-1"><strong>Expected Delivery:</strong> {po.expected_date}</p>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-2">Financial Summary</h4>
              <p className="text-sm"><strong>Tax Included:</strong> Rs. {parseFloat(po.tax || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p className="text-sm mt-1 text-blue-600 font-bold"><strong>Total Value:</strong> Rs. {parseFloat(po.total_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-3">Ordered Items List</h4>
            <div className="border border-slate-100 rounded-lg overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="p-3">Product Description</th>
                    <th className="p-3 text-center">Quantity</th>
                    <th className="p-3 text-right">Unit Price</th>
                    <th className="p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {po.items?.map((item, index) => {
                    // 🧮 NaN ප්‍රශ්නය මඟහරවා ගැනීමට ආරක්ෂිතව අගයන් ගණනය කිරීම
                    const qty = parseInt(item.quantity || 0, 10);
                    const unitPrice = parseFloat(item.unit_price || 0);
                    const calculatedTotal = qty * unitPrice;

                    return (
                      <tr key={index} className="hover:bg-slate-50/50">
                        {/* 🛠️ Product Name සහ Code එක එකට පෙන්වන කොටස */}
                        <td className="p-3 font-medium text-slate-700">
                          <div>{item.product?.product_name || item.product?.name || 'Unknown Product'}</div>
                          <span className="text-xs text-slate-400 font-normal">{item.product_code}</span>
                        </td>
                        <td className="p-3 text-center text-slate-600">{qty}</td>
                        <td className="p-3 text-right text-slate-600">
                          Rs. {unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="p-3 text-right font-semibold text-slate-700">
                          Rs. {calculatedTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
        
        <div className="bg-slate-50 p-4 border-t border-slate-100 text-center text-xs text-slate-400">
          Powered by Smart Inventory & Supply Chain Management System
        </div>
      </div>
    </div>
  );
};

export default PublicPOTracking;