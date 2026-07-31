import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardView = ({ userRole }) => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalSuppliers: 0,
    lowStock: 0
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);

  // 🛡️ string format එක එකම විදිහකට සකසා ගැනීම (Spaces/Underscores අයින් කරලම)
  const displayRole = userRole || 'Staff';
  const cleanRole = displayRole.replace(/[\s_]/g, '').toLowerCase();

  useEffect(() => {
    fetchDashboardData();
  }, [userRole]); // role එක වෙනස් වුවහොත් නැවත දත්ත ලබා ගනී

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

      // 🔄 1. Role එක අනුව API Endpoints ලැයිස්තුව Dynamic ලෙස සකස් කිරීම
      const apiCalls = {
        products: axios.get(`${baseUrl}/products`, { headers }).catch(() => ({ data: [] })),
        transactions: axios.get(`${baseUrl}/inventory/transactions`, { headers }).catch(() => ({ data: [] }))
      };

      // Admin ට විතරක් Users API එක කැඳවයි
      if (cleanRole === 'admin') {
        apiCalls.users = axios.get(`${baseUrl}/users`, { headers }).catch(() => ({ data: [] }));
      }

      // Admin සහ Manager ට විතරක් Suppliers API එක කැඳවයි
      if (['admin', 'manager'].includes(cleanRole)) {
        apiCalls.suppliers = axios.get(`${baseUrl}/suppliers`, { headers }).catch(() => ({ data: [] }));
      }

      // 🔄 2. සකස් කරගත් API Calls ටික විතරක් බලාපොරොත්තු වීම
      const keys = Object.keys(apiCalls);
      const responses = await Promise.all(Object.values(apiCalls));
      
      // ලැබුණු ප්‍රතිඵල Object එකකට Map කිරීම
      const resData = {};
      keys.forEach((key, index) => {
        resData[key] = responses[index].data || [];
      });

      const products = resData.products || [];
      const transactions = resData.transactions || [];
      const suppliers = resData.suppliers || [];
      const usersRaw = resData.users || [];
      const users = Array.isArray(usersRaw) ? usersRaw : usersRaw.users || [];

      // Low Stock ගණනය කිරීම
      const lowStockCount = products.filter(p => (p.quantity || 0) < (p.reorder_level || 10)).length;

      setStats({
        totalProducts: products.length,
        totalUsers: users.length,
        totalSuppliers: suppliers.length,
        lowStock: lowStockCount
      });

      setRecentTransactions(transactions.slice(0, 5));

      // 📊 Chart Data Handling (පරණ කෝඩ් එකමයි)
      const monthlyData = {};
      const sortedTransactions = [...transactions].reverse();

      sortedTransactions.forEach(tx => {
        if (!tx.date) return;
        const dateObj = new Date(tx.date);
        const monthName = dateObj.toLocaleString('en-US', { month: 'short' });

        if (!monthlyData[monthName]) {
          monthlyData[monthName] = { stockIn: 0, stockOut: 0 };
        }

        const status = tx.status ? tx.status.trim().toLowerCase() : '';

        if (status === 'stock in') {
          monthlyData[monthName].stockIn += parseInt(tx.quantity) || 0;
        } else if (status === 'stock out') {
          monthlyData[monthName].stockOut += parseInt(tx.quantity) || 0;
        }
      });

      const months = Object.keys(monthlyData);
      const stockInValues = months.map(m => monthlyData[m].stockIn);
      const stockOutValues = months.map(m => monthlyData[m].stockOut);

      setChartData({
        labels: months,
        datasets: [
          {
            label: 'Stock In',
            data: stockInValues,
            backgroundColor: (ctx) => {
              const chart = ctx.chart;
              const { ctx: c, chartArea } = chart;
              if (!chartArea) return '#4f46e5';
              const gradient = c.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
              gradient.addColorStop(0, '#4338ca');
              gradient.addColorStop(1, '#22d3ee');
              return gradient;
            },
            borderRadius: 8,
            barPercentage: 0.55,
          },
          {
            label: 'Stock Out',
            data: stockOutValues,
            backgroundColor: (ctx) => {
              const chart = ctx.chart;
              const { ctx: c, chartArea } = chart;
              if (!chartArea) return '#e11d48';
              const gradient = c.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
              gradient.addColorStop(0, '#9f1239');
              gradient.addColorStop(1, '#fb7185');
              return gradient;
            },
            borderRadius: 8,
            barPercentage: 0.55,
          }
        ]
      });

    } catch (err) {
      console.error("Dashboard data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#e2e8f0',
        bodyColor: '#cbd5e1',
        titleFont: { weight: '700', size: 12 },
        bodyFont: { size: 11 },
        padding: 10,
        cornerRadius: 8,
        displayColors: true,
        boxPadding: 4,
      },
    },
    scales: {
      y: {
        grid: { display: true, color: '#eef1f6', drawTicks: false },
        border: { display: false },
        ticks: { font: { size: 10 }, color: '#94a3b8', padding: 8 },
        beginAtZero: true
      },
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { font: { size: 11, weight: '600' }, color: '#475569' }
      }
    }
  };

  // 📋 3. Role එක මත පදනම්ව පමණක් Overview Cards පෙන්වීම (Show Condition Modified)
  const statCards = [
    {
      key: 'products',
      label: 'Total Products',
      value: stats.totalProducts,
      icon: '📦',
      show: ['admin', 'manager', 'stockkeeper'].includes(cleanRole), // Staff / Supplier ට සඟවා ඇත
      variant: 'solid',
      bg: 'bg-gradient-to-br from-indigo-500 to-blue-500',
      textColor: 'text-white',
      subColor: 'text-indigo-100',
      iconBg: 'bg-white/20',
    },
    {
      key: 'users',
      label: 'Active Users',
      value: stats.totalUsers,
      icon: '👥',
      show: cleanRole === 'admin', // Admin ට විතරයි
      variant: 'outline',
      bg: 'bg-white border border-slate-100',
      textColor: 'text-slate-900',
      subColor: 'text-slate-400',
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-600',
    },
    {
      key: 'suppliers',
      label: 'Suppliers',
      value: stats.totalSuppliers,
      icon: '🏢',
      show: ['admin', 'manager'].includes(cleanRole), // Admin සහ Manager ට විතරයි
      variant: 'outline',
      bg: 'bg-white border border-slate-100',
      textColor: 'text-slate-900',
      subColor: 'text-slate-400',
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
    {
      key: 'lowstock',
      label: 'Low Stock Items',
      value: stats.lowStock,
      icon: '⚠️',
      show: ['admin', 'manager', 'stockkeeper'].includes(cleanRole), // නිවැරදි කාර්ය මණ්ඩලයට පමණි
      variant: 'solid',
      bg: stats.lowStock > 0 ? 'bg-gradient-to-br from-rose-500 to-red-400' : 'bg-gradient-to-br from-emerald-500 to-teal-400',
      textColor: 'text-white',
      subColor: stats.lowStock > 0 ? 'text-rose-100' : 'text-emerald-100',
      iconBg: 'bg-white/20',
      pulse: stats.lowStock > 0,
    },
  ];

  return (
    <div
      className="min-h-screen text-gray-800 p-4 md:p-8 flex items-start justify-center"
      style={{
        background: 'linear-gradient(160deg, #dfe4fb 0%, #eef0fb 45%, #e3e9fb 100%)',
      }}
    >
      <div className="w-full max-w-[1500px] bg-white rounded-[28px] shadow-xl shadow-indigo-200/50 p-6 md:p-8">

        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-[28px] font-extrabold text-slate-900 tracking-tight">
              Hello, <span className="text-indigo-600">{displayRole}</span> 👋
            </h1>
            <p className="text-xs text-slate-400 mt-1.5">
              Here's what's happening with your inventory today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-2xl flex items-center gap-2">
              <span className="text-indigo-500">📅</span>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-400 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-200">
              {displayRole?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
        </div>

        {/* Stat Cards Area */}
        {statCards.some(c => c.show) && (
          <>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Overview</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {statCards.filter(c => c.show).map(card => (
                <div
                  key={card.key}
                  className={`group relative rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 ${card.bg} ${card.variant === 'solid' ? 'shadow-md' : 'shadow-sm'}`}
                >
                  <div className="p-5 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <p className={`text-[11px] font-bold uppercase tracking-wider ${card.subColor}`}>{card.label}</p>
                      <div className={`${card.iconBg} ${card.iconColor || ''} ${card.pulse ? 'animate-pulse' : ''} w-9 h-9 rounded-lg flex items-center justify-center text-base`}>
                        {card.icon}
                      </div>
                    </div>
                    <h3 className={`text-3xl font-extrabold tabular-nums ${card.textColor}`}>
                      {loading ? (
                        <span className="inline-block w-12 h-7 bg-black/10 rounded animate-pulse" />
                      ) : card.value}
                    </h3>
                    <div className={`h-1.5 w-full rounded-full ${card.variant === 'solid' ? 'bg-white/25' : 'bg-slate-100'} overflow-hidden`}>
                      <div
                        className={`h-full rounded-full ${card.variant === 'solid' ? 'bg-white' : 'bg-indigo-400'}`}
                        style={{ width: loading ? '0%' : '70%' }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* 📉 Chart & Recent Activity (Staff / Supplier ට සාමාන්‍යයෙන් බ්ලොක් කරනු ලැබේ) */}
        {['admin', 'manager', 'stockkeeper'].includes(cleanRole) ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart Container */}
            <div className="lg:col-span-2 bg-slate-50/70 p-6 rounded-2xl border border-slate-100 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Inventory Movement Trend</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Monthly breakdown of stock inflow vs outflow</p>
                </div>
                <div className="flex space-x-3 text-[10px] font-bold">
                  <span className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-gradient-to-br from-indigo-600 to-cyan-400" /> Stock In
                  </span>
                  <span className="flex items-center gap-1.5 bg-rose-50 text-rose-700 px-2.5 py-1 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-gradient-to-br from-rose-800 to-rose-400" /> Stock Out
                  </span>
                </div>
              </div>

              <div className="h-64 relative">
                {loading ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-xs text-slate-400">Loading chart data...</p>
                  </div>
                ) : chartData.labels.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-xs text-slate-400">No transaction history available for charts.</p>
                  </div>
                ) : (
                  <Bar data={chartData} options={chartOptions} />
                )}
              </div>
            </div>

            {/* Recent Transactions Container */}
            <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-100">
              <div className="mb-4">
                <h3 className="font-bold text-slate-800 text-sm">Recent Transactions</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Latest stock activities logged</p>
              </div>

              <div className="flow-root">
                <ul className="divide-y divide-slate-100 max-h-64 overflow-y-auto pr-1">
                  {loading ? (
                    <p className="text-xs text-slate-400 text-center py-6">Loading activities...</p>
                  ) : recentTransactions.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-6">No recent history.</p>
                  ) : (
                    recentTransactions.map((tx) => {
                      const isIn = tx.status && tx.status.trim().toLowerCase() === 'stock in';
                      return (
                        <li key={tx.transaction_id || tx.id} className="py-3 flex items-start justify-between text-xs group">
                          <div className="flex space-x-3">
                            <div className={`p-2 rounded-lg h-fit font-bold ${isIn ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'}`}>
                              {isIn ? '📥' : '📤'}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-700 truncate max-w-[140px]">{tx.product_code}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">{tx.transaction_id || 'N/A'} • {new Date(tx.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="text-right flex flex-col items-end">
                            <p className={`font-extrabold tabular-nums ${isIn ? 'text-indigo-600' : 'text-rose-600'}`}>
                              {isIn ? `+${tx.quantity}` : `-${tx.quantity}`}
                            </p>
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-bold mt-1">
                              Completed
                            </span>
                          </div>
                        </li>
                      );
                    })
                  )}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-sm text-slate-500 font-medium">Welcome to the portal. Please select an option from the sidebar to manage features.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default DashboardView;