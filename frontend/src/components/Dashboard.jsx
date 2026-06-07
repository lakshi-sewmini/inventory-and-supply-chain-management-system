import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DashboardView = ({ userRole }) => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalSuppliers: 0,
    lowStock: 0
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

      const [prodRes, userRes, supRes] = await Promise.all([
        axios.get(`${baseUrl}/products`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${baseUrl}/users`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${baseUrl}/suppliers`, { headers }).catch(() => ({ data: [] }))
      ]);

      const products = prodRes.data || [];
      const users = Array.isArray(userRes.data) ? userRes.data : userRes.data.users || [];
      const suppliers = supRes.data || [];
      
      const lowStockCount = products.filter(p => (p.quantity || 0) < (p.reorder_level || 10)).length;

      setStats({
        totalProducts: products.length,
        totalUsers: users.length,
        totalSuppliers: suppliers.length,
        lowStock: lowStockCount
      });

      setRecentTransactions([
        { id: 'TRN-094', type: 'Stock In', item: 'Dell Laptop Core i5', qty: 12, time: 'Just now', status: 'Completed' },
        { id: 'TRN-093', type: 'Stock Out', item: 'HP Keyboard K1500', qty: 45, time: '20 mins ago', status: 'Completed' },
        { id: 'TRN-092', type: 'Stock In', item: 'Logitech Wireless Mouse', qty: 100, time: '2 hours ago', status: 'Completed' },
        { id: 'TRN-091', type: 'Stock Out', item: 'Asus Monitor 24"', qty: 5, time: 'Yesterday', status: 'Pending' },
      ]);

    } catch (err) {
      console.error("Dashboard data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🛡️ ආරක්ෂිත පියවරක්: යම් හෙයකින් userRole තවම ලැබී නැත්නම් 'Loading...' පෙන්වන්න
  const displayRole = userRole || 'User';

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen text-gray-800">
      
      {/* 1. Upper Welcome Banner */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">
            Welcome back! Logged in as <span className="font-bold text-blue-600 uppercase">{displayRole}</span>.
          </p>
        </div>
        <div className="text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-3 py-2 rounded-lg shadow-sm">
          📅 {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* 2. Analytics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        
        {/* Card 1: Total Products */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Products</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">
              {loading ? '...' : stats.totalProducts}
            </h3>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg text-blue-600 text-xl">📦</div>
        </div>

        {/* 🔒 Card 2: Active Users - පෙන්වන්නේ Admin හට පමණි */}
        {displayRole === 'Admin' && (
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Users</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">
                {loading ? '...' : stats.totalUsers}
              </h3>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg text-purple-600 text-xl">👥</div>
          </div>
        )}

        {/* Card 3: Total Suppliers */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Suppliers</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">
              {loading ? '...' : stats.totalSuppliers}
            </h3>
          </div>
          <div className="bg-amber-50 p-3 rounded-lg text-amber-600 text-xl">🏢</div>
        </div>

        {/* Card 4: Low Stock Alert */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Low Stock Items</p>
            <h3 className="text-2xl font-bold text-rose-600 mt-1">
              {loading ? '...' : stats.lowStock}
            </h3>
          </div>
          <div className={`${stats.lowStock > 0 ? 'bg-rose-50 text-rose-600 animate-pulse' : 'bg-emerald-50 text-emerald-600'} p-3 rounded-lg text-xl`}>
            ⚠️
          </div>
        </div>

      </div>

      {/* 3. Chart & Recent Activities Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Inventory Movement Trend</h3>
              <p className="text-[11px] text-slate-400">Monthly breakdown of stock inflow vs outflow</p>
            </div>
            <div className="flex space-x-2 text-[10px] font-semibold">
              <span className="flex items-center"><span className="w-2.5 h-2.5 bg-blue-500 rounded-full mr-1"></span> Stock In</span>
              <span className="flex items-center"><span className="w-2.5 h-2.5 bg-rose-400 rounded-full mr-1"></span> Stock Out</span>
            </div>
          </div>
          
          <div className="h-56 bg-slate-50/70 rounded-lg border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 text-xs">
            📊 [Chart Data Visualizer Placeholder]
            <span className="text-[10px] text-slate-300 mt-1">Integrate Chart.js or Recharts here later</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="mb-4">
            <h3 className="font-bold text-slate-800 text-sm">Recent Transactions</h3>
            <p className="text-[11px] text-slate-400">Latest stock activities logged</p>
          </div>

          <div className="flow-root">
            <ul className="divide-y divide-slate-100 max-h-56 overflow-y-auto pr-1">
              {recentTransactions.map((tx, idx) => (
                <li key={idx} className="py-3 flex items-start justify-between text-xs">
                  <div className="flex space-x-3">
                    <div className={`p-1.5 rounded-md h-fit font-bold ${tx.type === 'Stock In' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {tx.type === 'Stock In' ? '📥' : '📤'}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-700 truncate max-w-[120px] sm:max-w-none">{tx.item}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{tx.id} • {tx.time}</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <p className={`font-bold ${tx.type === 'Stock In' ? 'text-emerald-600' : 'text-slate-600'}`}>
                      {tx.type === 'Stock In' ? `+${tx.qty}` : `-${tx.qty}`}
                    </p>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium">{tx.status}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardView;