import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReportView = () => {
  // 📦 Report Types: 'Stock Report', 'Supplier Report', 'Purchase Report'
  const [reportType, setReportType] = useState('Stock Report');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Automatically refresh preview calculations when configurations change
  useEffect(() => {
    handleGenerateReport();
  }, [reportType, dateFrom, dateTo]);

  const handleGenerateReport = async () => {
  try {
    setLoading(true);
    setError(null);
    
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

    // 🔗 කෙලින්ම ඔයාගේ Laravel ReportController එකේ ලියපු previewData endpoint එකට කතා කරනවා
    const response = await axios.get(`${baseUrl}/reports/preview`, {
      headers,
      params: {
        report_type: reportType, // 'Stock Report', 'Supplier Report', 'Purchase Report'
        date_from: dateFrom,
        date_to: dateTo
      }
    });

    const resData = response.data || [];

    // ===================================================
    // 1. INVENTORY / STOCK REPORT
    // ===================================================
    if (reportType === 'Stock Report') {
      setReportData(resData); // Laravel එකෙන් දැනටමත් opening, closing, stockIn ඔක්කොම හදලමයි එවන්නේ!
    } 
    
    // ===================================================
    // 2. SUPPLIERS DIRECTORY
    // ===================================================
    else if (reportType === 'Supplier Report') {
      setReportData(resData.map(s => ({
        supplier_id: s.supplier_id,
        supplier_name: s.supplier_name,
        contact_person: s.contact_person || 'N/A',
        phone: s.phone,
        email: s.email
      })));
    } 
    
    // ===================================================
    // 3. PURCHASES HISTORY
    // ===================================================
    else if (reportType === 'Purchase Report') {
      setReportData(resData.map(p => ({
        po_number: p.po_number,
        order_date: p.order_date,
        supplier_name: p.supplier?.supplier_name || 'N/A', // Join කරලා ආපු Supplier ගේ නම ගන්නවා
        total_amount: p.total_amount,
        status: p.status
      })));
    }

  } catch (err) {
    console.error("Data fetch error:", err);
    setError("Failed to fetch custom report preview data from server.");
  } finally {
    setLoading(false);
  }
};``

  const handleExport = async (format) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
      
      const endpoint = 'reports/export';

      const response = await axios.get(`${baseUrl}/${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { 
          report_type: reportType, 
          format: format, 
          date_from: dateFrom, 
          date_to: dateTo 
        },
        responseType: 'blob', 
      });

      if (response.data.type === 'application/json') {
        const textError = await response.data.text();
        const errorObj = JSON.parse(textError);
        alert(`Export Error: ${errorObj.message || errorObj.error || 'Failed to generate file'}`);
        return;
      }

      const blobType = format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      const ext = format === 'pdf' ? 'pdf' : 'xlsx';

      const blob = new Blob([response.data], { type: response.headers['content-type'] || blobType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const safeFileName = reportType.trim().replace(/\s+/g, '_');
      link.setAttribute('download', `${safeFileName}_Report.${ext}`);
      
      document.body.appendChild(link);
      link.click();
      
      window.URL.revokeObjectURL(url);
      link.remove();
    } catch (err) {
      console.error("Export error:", err);
      alert("Failed to download the file document. Please check console errors.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen text-gray-800 printable-area">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        
        {/* Left Side Config Box */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 space-y-4 h-fit no-print">
          <h3 className="font-bold text-slate-800 text-sm">Reports Configuration</h3>
          
          <div className="flex flex-col space-y-1">
            <label className="text-xs text-slate-400 font-medium">Report Type</label>
            <select 
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="border border-slate-200 rounded-lg p-2 text-xs bg-white outline-none font-medium text-slate-700"
            >
              <option value="Stock Report">📦 Inventory / Stock Report</option>
              <option value="Supplier Report">🏢 Suppliers Directory</option>
              <option value="Purchase Report">🧾 Purchases History</option>
            </select>
          </div>

          {reportType !== 'Supplier Report' && (
            <>
              <div className="flex flex-col space-y-1">
                <label className="text-xs text-slate-400 font-medium">Date From</label>
                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="border border-slate-200 rounded-lg p-2 text-xs bg-white outline-none" />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-xs text-slate-400 font-medium">Date To</label>
                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="border border-slate-200 rounded-lg p-2 text-xs bg-white outline-none" />
              </div>
            </>
          )}

          <button 
            onClick={handleGenerateReport}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 rounded-lg text-xs font-semibold shadow-sm transition-all"
          >
            {loading ? 'Generating...' : 'Filter & Refresh'}
          </button>
        </div>

        {/* Right Side Table Data Preview */}
        <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 no-print">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">{reportType} Preview</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {reportType !== 'Supplier Report' ? `Showing results from ${dateFrom || 'Beginning'} to ${dateTo || 'Today'}` : 'Complete list of active suppliers'}
              </p>
            </div>
            <div className="flex space-x-2 text-xs">
              <button onClick={() => window.print()} className="px-3 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50 font-medium text-slate-600 flex items-center gap-1">
                🖨️ Print
              </button>
              <button onClick={() => handleExport('pdf')} className="px-3 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50 font-medium text-slate-600">
                📥 PDF
              </button>
              <button onClick={() => handleExport('excel')} className="px-3 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50 font-medium text-emerald-600">
                📊 Excel
              </button>
            </div>
          </div>

          {error && <div className="p-3 mb-4 text-xs text-red-600 bg-red-50 rounded-lg">{error}</div>}

          {/* Report Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse border border-slate-100 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                  {reportType === 'Stock Report' && (
                    <>
                      <th className="p-3">Product Code</th><th className="p-3">Product Name</th><th className="p-3">Opening Stock</th><th className="p-3">Stock In</th><th className="p-3">Stock Out</th><th className="p-3">Closing Stock</th>
                    </>
                  )}
                  {reportType === 'Supplier Report' && (
                    <>
                      <th className="p-3">Supplier ID</th><th className="p-3">Supplier Name</th><th className="p-3">Contact Person</th><th className="p-3">Phone</th><th className="p-3">Email</th>
                    </>
                  )}
                  {reportType === 'Purchase Report' && (
                    <>
                      <th className="p-3">Purchase No</th><th className="p-3">Date</th><th className="p-3">Supplier</th><th className="p-3">Total Amount</th><th className="p-3">Status</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-slate-600">
                {loading ? (
                  <tr><td colSpan="6" className="p-8 text-center text-slate-400">Processing records, please wait...</td></tr>
                ) : reportData.length === 0 ? (
                  <tr><td colSpan="6" className="p-8 text-center text-slate-400">No records found.</td></tr>
                ) : (
                  reportData.map((row, index) => (
                    <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                      {/* A. Inventory Stock Rows Mapping */}
                      {reportType === 'Stock Report' && (
                        <>
                          <td className="p-3 font-semibold text-slate-700">{row.code}</td>
                          <td className="p-3 font-medium">{row.name}</td>
                          <td className="p-3 text-slate-500">{row.opening}</td>
                          <td className="p-3 text-emerald-600 font-semibold">+{row.stockIn}</td>
                          <td className="p-3 text-rose-600 font-semibold">-{row.stockOut}</td>
                          <td className="p-3 font-bold text-slate-800">{row.closing}</td>
                        </>
                      )}
                      
                      {/* B. Supplier Directory Rows Mapping */}
                      {reportType === 'Supplier Report' && (
                        <>
                          <td className="p-3 font-semibold text-slate-700">#{row.supplier_id}</td>
                          <td className="p-3 font-medium text-slate-800">{row.supplier_name}</td>
                          <td className="p-3">{row.contact_person}</td>
                          <td className="p-3">{row.phone}</td>
                          <td className="p-3 text-slate-400">{row.email}</td>
                        </>
                      )}
                      
                      {/* C. Purchases History Rows Mapping */}
                      {reportType === 'Purchase Report' && (
                        <>
                          <td className="p-3 font-semibold text-slate-700">#{row.po_number}</td>
                          <td className="p-3">{row.order_date}</td>
                          <td className="p-3 font-medium">{row.supplier_name}</td>
                          <td className="p-3 font-bold text-slate-800">Rs. {parseFloat(row.total_amount).toFixed(2)}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${row.status === 'Received' || row.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-warning/10 text-amber-600'}`}>
                              {row.status}
                            </span>
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          .printable-area { background: white !important; padding: 0 !important; }
          body { background: white; }
        }
      `}</style>
    </div>
  );
};

export default ReportView;