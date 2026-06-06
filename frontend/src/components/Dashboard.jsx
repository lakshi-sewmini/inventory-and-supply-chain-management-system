import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DashboardView = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSuppliers: 0,
    lowStockAlerts: 0,
    totalPurchases: 0,
    pendingOrders: 0,
    todayTransactions: 0,
    transactions: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Login වෙනකොට LocalStorage එකේ සේව් කරගත් Token එක මෙතනින් ගන්නවා
        const token = localStorage.getItem('token'); 
        
        // 2. .env එකේ තියෙන URL එකට (http://localhost:8000/api) Token එකත් එක්ක කතා කරනවා
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        });
        
        // 3. ලැබෙන දත්ත අපේ State එකට සෙට් කරනවා
        setStats(response.data);
      } catch (err) {
        console.error("Dashboard Data Fetch Error:", err);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* 1. ඉහළ ඇති Stats 4 */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Products" value={stats.totalProducts} />
        <StatCard title="Total Suppliers" value={stats.totalSuppliers} />
        <StatCard title="Low Stock Alerts" value={stats.lowStockAlerts} />
        <StatCard title="Total Purchases" value={stats.totalPurchases} />
      </div>

      {/* 2. මැද කොටස (Inventory & Transactions) */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 shadow-sm border border-gray-200 rounded-lg">
          <h2 className="font-bold text-gray-700 mb-6">INVENTORY SUMMARY</h2>
          {/* මෙතනට Chart එකක් එන්න පුළුවන් */}
        </div>

        <div className="bg-white p-6 shadow-sm border border-gray-200 rounded-lg">
          <h2 className="font-bold text-gray-700 mb-6">Recent transaction</h2>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b bg-gray-50 text-gray-500 font-semibold">
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Type</th>
                <th className="p-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.transactions && stats.transactions.length > 0 ? (
                stats.transactions.map((tx, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="p-2">{tx.date || tx.created_at}</td>
                    <td className="p-2 font-medium">{tx.status}</td>
                    <td className="p-2">
                      <span className="px-2 py-0.5 text-xs font-bold rounded bg-green-100 text-green-700">Completed</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-4 text-center text-gray-400">No recent transactions</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. පතුලේ ඇති Summary Boxes */}
      <div className="grid grid-cols-3 gap-6">
        <SummaryBox title="Low Stock Alerts" value={stats.lowStockAlerts} unit="items" />
        <SummaryBox title="Pending orders" value={stats.pendingOrders} unit="orders" />
        <SummaryBox title="Today Transaction" value={stats.todayTransactions} unit="items" />
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white p-6 shadow-sm border border-gray-200 rounded-lg">
    <h3 className="text-gray-500 uppercase text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold mt-2">{value}</p>
  </div>
);

const SummaryBox = ({ title, value, unit }) => (
  <div className="bg-teal-600 p-6 rounded-lg text-white">
    <p>{title}</p>
    <h3 className="text-2xl font-bold">{value} {unit}</h3>
  </div>
);

export default DashboardView;