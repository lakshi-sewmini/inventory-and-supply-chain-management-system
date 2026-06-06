import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StockAlertView = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/stock-alerts`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setAlerts(res.data))
    .catch(err => console.error("Error fetching stock alerts:", err));
  }, []);

  return (
    <div className="p-8 w-full">
      <h2 className="text-2xl font-bold mb-6 text-red-600">⚠️ Low Stock Alerts</h2>
      <div className="bg-white rounded-lg border border-red-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-red-50 border-b border-red-200 text-red-700 text-sm font-semibold">
            <tr>
              <th className="p-3">Product Code</th>
              <th className="p-3">Product Name</th>
              <th className="p-3">Available Qty</th>
              <th className="p-3">Reorder Level</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {alerts.length === 0 ? (
              <tr><td colSpan="5" className="p-4 text-center text-green-600 font-bold">✅ All stocks are stable! No alerts.</td></tr>
            ) : (
              alerts.map(item => (
                <tr key={item.product_code} className="border-b bg-red-50/30 hover:bg-red-50 text-gray-800">
                  <td className="p-3 font-bold">{item.product_code}</td>
                  <td className="p-3">{item.product_name}</td>
                  <td className="p-3 text-red-600 font-bold">{item.current_stock}</td>
                  <td className="p-3 font-semibold text-gray-500">{item.reorder_level}</td>
                  <td className="p-3">
                    <button className="bg-red-500 text-white text-xs px-3 py-1 rounded font-bold uppercase tracking-wider hover:bg-red-600">Reorder</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockAlertView;