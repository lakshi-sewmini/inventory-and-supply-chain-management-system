import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PurchaseView = () => {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/purchases`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setPurchases(res.data))
    .catch(err => console.error("Error fetching purchases:", err));
  }, []);

  return (
    <div className="p-8 w-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-700">Purchase Orders (PO)</h2>
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b text-gray-600 text-sm font-semibold">
            <tr>
              <th className="p-3">PO Number</th>
              <th className="p-3">Supplier</th>
              <th className="p-3">Order Date</th>
              <th className="p-3">Total Amount</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {purchases.length === 0 ? (
              <tr><td colSpan="5" className="p-4 text-center text-gray-400">No Purchase Orders Found</td></tr>
            ) : (
              purchases.map(po => (
                <tr key={po.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-semibold">{po.po_number}</td>
                  <td className="p-3">{po.supplier_name}</td>
                  <td className="p-3">{po.order_date}</td>
                  <td className="p-3">Rs. {po.total_amount}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-bold">{po.status}</span>
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

export default PurchaseView;