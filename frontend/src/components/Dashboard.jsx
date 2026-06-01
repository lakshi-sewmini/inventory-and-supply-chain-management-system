import React, { useState, useEffect } from 'react';

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
    // API එකෙන් දත්ත ලබාගැනීම
    fetch('http://localhost:8000/api/dashboard')
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error("Error:", err));
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* 1. ඉහළ ඇති Stats 4 - Backend එකෙන් එන දත්ත */}
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
          <table className="w-full text-sm">
             {/* Transaction data Mapping */}
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

// Component එකක් ලෙස සකසා ගැනීම
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