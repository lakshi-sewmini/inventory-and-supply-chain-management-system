import React from 'react';

const ReportView = () => {
  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen text-gray-800">
      <div className="grid grid-cols-4 gap-6 max-w-6xl mx-auto">
        {/* Left Side Config Box */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 space-y-4 h-fit">
          <h3 className="font-bold text-slate-800 text-sm">Reports</h3>
          <div className="flex flex-col space-y-1">
            <label className="text-xs text-slate-400 font-medium">Report Type</label>
            <select className="border border-slate-200 rounded-lg p-2 text-xs bg-white outline-none"><option>Stock Report</option></select>
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-xs text-slate-400 font-medium">Date From</label>
            <input type="date" className="border border-slate-200 rounded-lg p-2 text-xs bg-white outline-none" />
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-xs text-slate-400 font-medium">Date To</label>
            <input type="date" className="border border-slate-200 rounded-lg p-2 text-xs bg-white outline-none" />
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-xs font-semibold shadow-sm transition-all">Generate Report</button>
        </div>

        {/* Right Side Table Data Preview */}
        <div className="col-span-3 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800 text-sm">Report Preview</h3>
            <div className="flex space-x-2 text-xs">
              <button className="px-3 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50 font-medium text-slate-600">🖨️ Print</button>
              <button className="px-3 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50 font-medium text-slate-600">📥 Export PDF</button>
              <button className="px-3 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50 font-medium text-slate-600">📊 Export Excel</button>
            </div>
          </div>
          <table className="w-full text-left text-xs border-collapse border border-slate-100 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold"><th className="p-3">Product Code</th><th className="p-3">Product Name</th><th className="p-3">Opening Stock</th><th className="p-3">Stock In</th><th className="p-3">Stock Out</th><th className="p-3">Closing Stock</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-slate-600">
              <tr><td className="p-3 font-semibold text-slate-700">P001</td><td className="p-3">Laptop Dell Inspiron</td><td className="p-3">30</td><td className="p-3 text-emerald-600 font-semibold">+10</td><td className="p-3 text-rose-600 font-semibold">-15</td><td className="p-3 font-bold text-slate-800">25</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportView;