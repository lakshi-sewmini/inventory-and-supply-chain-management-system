import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StockAlertsView = () => {
  const [lowStockProducts, setLowStockProducts] = useState([]);

  useEffect(() => {
    fetchLowStock();
  }, []);

  const fetchLowStock = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Reorder Level එකට වඩා Quantity එක සමාන හෝ අඩු බඩු ටික විතරක් ගන්නවා
      const alerts = res.data.filter(p => (p.quantity || 0) <= (p.reorder_level || 10));
      setLowStockProducts(alerts);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen text-gray-800">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center">
              <span className="mr-2 text-rose-500 animate-bounce">⚠️</span> Low Stock Alerts
            </h2>
            <p className="text-xs text-slate-400 mt-1">Items that require urgent purchasing or restocking.</p>
          </div>
          <span className="bg-rose-50 text-rose-600 px-3 py-1.5 rounded-lg text-xs font-bold border border-rose-100">
            {lowStockProducts.length} Items Critical
          </span>
        </div>

        {/* Alerts Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-100">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold">
                <th className="p-4">Product Code</th>
                <th className="p-4">Product Name</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-center">Current Qty</th>
                <th className="p-4 text-center">Reorder Level</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lowStockProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400 bg-white font-medium text-xs">
                    🎉 Excellent! All items are well stocked above reorder levels.
                  </td>
                </tr>
              ) : (
                lowStockProducts.map((p, i) => (
                  <tr key={i} className="hover:bg-rose-50/20 transition-colors">
                    <td className="p-4 font-bold text-slate-700">{p.product_code}</td>
                    <td className="p-4 text-slate-600">{p.product_name}</td>
                    <td className="p-4 text-slate-400 text-xs font-medium">{p.brand || 'General'}</td>
                    <td className="p-4 text-center">
                      <span className="px-2.5 py-1 rounded-md font-bold bg-rose-50 text-rose-600 text-xs">
                        {p.quantity || 0}
                      </span>
                    </td>
                    <td className="p-4 text-center text-slate-500 font-semibold text-xs">{p.reorder_level || 10}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        (p.quantity || 0) === 0 ? 'bg-rose-600 text-white' : 'bg-amber-50 text-amber-600 border border-amber-100'
                      }`}>
                        {(p.quantity || 0) === 0 ? 'Out of Stock' : 'Low Stock'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StockAlertsView;