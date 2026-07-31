import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// 💡 1. App.js එකෙන් එවන user prop එක මෙතනින් ලබාගන්නවා
const InventoryView = ({ user }) => {
  const [status, setStatus] = useState('Stock In'); 
  const [dbTransactions, setDbTransactions] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  const [qrInput, setQrInput] = useState('');
  const qrInputRef = useRef(null);

  // 💡 2. ලොග් වී සිටින පරිශීලකයා Staff ද කියා පරීක්ෂා කිරීම
  const isStaff = user?.role?.toLowerCase() === 'staff';

  const [formData, setFormData] = useState({ 
    transaction_id: '', 
    date: new Date().toISOString().split('T')[0], 
    supplier: '', 
    items: [{ product_code: '', batch_no: '', quantity: 0, unit_cost: 0 }] 
  });

  // DATABASE එකෙන් TRANSACTIONS ලෝඩ් කිරීම
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/inventory/transactions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (Array.isArray(res.data)) {
        setDbTransactions(res.data);
      } else if (res.data && Array.isArray(res.data.transactions)) {
        setDbTransactions(res.data.transactions);
      } else {
        setDbTransactions([]);
      }
      
      setLoading(false);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    // Staff නොවේ නම් පමණක් QR Input එකට focus කරයි
    if (!isStaff && qrInputRef.current) qrInputRef.current.focus();
  }, [isStaff]);

  const generateBatchNumber = (productCode = '') => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    const codePart = productCode ? `${productCode}-` : '';
    return `BAT-${codePart}${year}${month}${day}-${hours}${minutes}`;
  };

  // QR SCAN LOGIC 
  const handleQRScanSubmit = async (e) => {
    e.preventDefault();
    if (isStaff || !qrInput) return; // 🛡️ Staff නම් QR Scan වලක්වයි

    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products/search-by-qr/${qrInput}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        const product = res.data.product;
        const targetProductCode = product.product_code || product.code || qrInput;

        const existingItemIdx = formData.items.findIndex(item => item.product_code === targetProductCode);

        if (existingItemIdx !== -1) {
          const updatedItems = [...formData.items];
          updatedItems[existingItemIdx].quantity += 1;
          setFormData({ ...formData, items: updatedItems });
        } else {
          const newBatchNo = generateBatchNumber(targetProductCode);
          if (formData.items.length === 1 && formData.items[0].product_code === '') {
            const updatedItems = [...formData.items];
            updatedItems[0] = {
              product_code: targetProductCode,
              batch_no: newBatchNo,
              quantity: 1,
              unit_cost: parseFloat(product.unit_price) || 0
            };
            setFormData({ ...formData, items: updatedItems });
          } else {
            setFormData({
              ...formData,
              items: [...formData.items, { product_code: targetProductCode, batch_no: newBatchNo, quantity: 1, unit_cost: parseFloat(product.unit_price) || 0 }]
            });
          }
        }
      }
      setQrInput('');
      if (qrInputRef.current) qrInputRef.current.focus();
    } catch (err) {
      console.error(err);
      alert('Product not found for this QR!');
      setQrInput('');
      if (qrInputRef.current) qrInputRef.current.focus();
    }
  };

  const handleAddItemRow = () => {
    setFormData({ 
      ...formData, 
      items: [...formData.items, { product_code: '', batch_no: generateBatchNumber(), quantity: 0, unit_cost: 0 }] 
    });
  };

  const handleRemoveItemRow = (index) => {
    if (formData.items.length > 1) {
      const updatedItems = formData.items.filter((_, idx) => idx !== index);
      setFormData({ ...formData, items: updatedItems });
    } else {
      alert("At least one item row is required!");
    }
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setFormData({ ...formData, items: updatedItems });
  };

  const handleCancel = () => {
    setFormData({ 
      transaction_id: '', 
      date: new Date().toISOString().split('T')[0], 
      supplier: '', 
      items: [{ product_code: '', batch_no: '', quantity: 0, unit_cost: 0 }] 
    });
    if (!isStaff && qrInputRef.current) qrInputRef.current.focus();
  };

  // DATA SAVE කිරීමේ FUNCTION එක
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isStaff) return; // 🛡️ Staff නම් Backend එකට Data යැවීම වලක්වයි

    try {
      const token = localStorage.getItem('token');
      
      const formattedItems = formData.items.map(item => ({
        product_code: item.product_code,
        batch_no: item.batch_no,
        quantity: parseInt(item.quantity) || 0,
        unit_cost: parseFloat(item.unit_cost) || 0
      }));

      const payload = {
        transaction_id: formData.transaction_id,
        status: status, 
        supplier: formData.supplier, 
        items: formattedItems
      };

      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/inventory/transactions`, payload, { 
        headers: { Authorization: `Bearer ${token}` } 
      });

      if (res.status === 201 || res.data.success) {
        alert('The inventory report was successfully updated!');
        handleCancel();
        fetchTransactions(); 
      }

    } catch (err) { 
      console.error("Submit Error:", err.response?.data);
      const errMsg = err.response?.data?.message || err.response?.data?.error || 'Transaction failed!';
      alert(`Error: ${errMsg}`); 
    }
  };

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen text-gray-800 space-y-8">
      
      {/* 🛡️ 3. Staff කෙනෙක් නොවේ නම් (Admin නම්) පමණක් Log Form එක පෙන්වයි */}
      {!isStaff && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 max-w-5xl mx-auto">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
            <h2 className="text-lg font-bold text-slate-800">Log {status}</h2>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button type="button" onClick={() => setStatus('Stock In')} className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${status === 'Stock In' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>Stock In</button>
              <button type="button" onClick={() => setStatus('Stock Out')} className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${status === 'Stock Out' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>Stock Out</button>
            </div>
          </div>

          <form onSubmit={handleQRScanSubmit} className="mb-6 bg-blue-50/40 p-4 rounded-xl border border-blue-100/60 flex items-center justify-between">
            <div className="flex flex-col space-y-1.5 w-full max-w-xs">
              <label className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center">
                <span className="animate-pulse mr-1.5 h-2 w-2 rounded-full bg-blue-600 inline-block"></span>
                Barcode / QR Scanner Input
              </label>
              <input 
                ref={qrInputRef}
                type="text" 
                value={qrInput}
                onChange={e => setQrInput(e.target.value)}
                placeholder="Scan Barcode or Type Code & Press Enter" 
                className="border border-blue-200 rounded-lg p-2 text-sm outline-none focus:border-blue-500 bg-white shadow-sm font-mono"
              />
            </div>
          </form>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-semibold text-slate-500">Reference No.</label>
                <input type="text" value={formData.transaction_id} placeholder="e.g. TRN-001" required onChange={e => setFormData({...formData, transaction_id: e.target.value})} className="border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-semibold text-slate-500">Date</label>
                <input type="date" value={formData.date} disabled className="border border-slate-200 rounded-lg p-2.5 text-sm outline-none bg-slate-50 text-slate-400 cursor-not-allowed" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-semibold text-slate-500">{status === 'Stock In' ? 'Supplier (Optional)' : 'Destination (Optional)'}</label>
                <input type="text" value={formData.supplier} placeholder="Enter source or destination" onChange={e => setFormData({...formData, supplier: e.target.value})} className="border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-700 mb-3">Add Items</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm border border-slate-100 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-semibold text-xs uppercase">
                      <th className="p-3"># Product Code</th>
                      <th className="p-3">Batch No.</th>
                      <th className="p-3">Qty</th>
                      <th className="p-3">Unit Cost (Rs.)</th>
                      <th className="p-3">Total (Rs.)</th>
                      <th className="p-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {formData.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-2"><input type="text" value={item.product_code || ''} placeholder="Product Code" required onChange={e => handleItemChange(idx, 'product_code', e.target.value)} className="w-full border border-slate-200 rounded-md p-1.5 text-xs outline-none focus:border-blue-500" /></td>
                        <td className="p-2"><input type="text" value={item.batch_no || ''} placeholder="e.g. BATCH-001" required onChange={e => handleItemChange(idx, 'batch_no', e.target.value)} className="w-full border border-slate-200 rounded-md p-1.5 text-xs outline-none focus:border-blue-500" /></td>
                        <td className="p-2"><input type="number" value={item.quantity || ''} placeholder="0" required onChange={e => handleItemChange(idx, 'quantity', parseInt(e.target.value) || 0)} className="w-full border border-slate-200 rounded-md p-1.5 text-xs outline-none focus:border-blue-500" /></td>
                        <td className="p-2"><input type="number" value={item.unit_cost || ''} placeholder="0.00" required onChange={e => handleItemChange(idx, 'unit_cost', parseFloat(e.target.value) || 0)} className="w-full border border-slate-200 rounded-md p-1.5 text-xs outline-none focus:border-blue-500" /></td>
                        <td className="p-3 text-slate-600 font-medium text-xs">{(item.quantity * item.unit_cost).toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                        <td className="p-2 text-center">
                          <button type="button" onClick={() => handleRemoveItemRow(idx)} className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button type="button" onClick={handleAddItemRow} className="mt-3 text-xs font-bold text-blue-600 hover:text-blue-700">+ Add Row Manually</button>
            </div>

            <div className="flex justify-end space-x-3 border-t border-slate-100 pt-4">
              <button type="button" onClick={handleCancel} className="px-5 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-500 hover:bg-slate-50">Cancel</button>
              <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm">Save {status}</button>
            </div>
          </form>
        </div>
      )}

      {/* HISTORY LOG SECTION - 💡 මෙම කොටස Staff සහ Admin දෙගොල්ලන්ටම පෙනේ */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 max-w-5xl mx-auto">
        <h3 className="text-md font-bold text-slate-800 mb-4">Transaction History Logs</h3>
        
        {loading ? (
          <p className="text-sm text-slate-400 text-center py-4">Loading historical data...</p>
        ) : dbTransactions.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4">No transactions found in database.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm rounded-lg overflow-hidden border border-slate-100">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold text-xs uppercase">
                  <th className="p-3">Ref No</th>
                  <th className="p-3">Product Code</th>
                  <th className="p-3">Batch</th>
                  <th className="p-3">Type</th>
                  <th className="p-3 text-right">Qty</th>
                  <th className="p-3 text-right">Unit Cost</th>
                  <th className="p-3 text-right">Total Cost</th>
                  <th className="p-3 text-center">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {dbTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-semibold text-slate-700">{tx.transaction_id || 'N/A'}</td>
                    <td className="p-3 text-slate-600 font-mono font-bold">{tx.product_code || 'N/A'}</td>
                    <td className="p-3 text-slate-500 font-mono">{tx.batch_no || 'N/A'}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${tx.status === 'Stock In' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                        {tx.status || 'N/A'}
                      </span>
                    </td>
                    <td className="p-3 text-right font-medium text-slate-700">{tx.quantity || 0}</td>
                    <td className="p-3 text-right text-slate-600">Rs. {tx.unit_cost ? parseFloat(tx.unit_cost).toFixed(2) : '0.00'}</td>
                    <td className="p-3 text-right font-bold text-slate-800">Rs. {tx.total_cost ? parseFloat(tx.total_cost).toFixed(2) : '0.00'}</td>
                    <td className="p-3 text-center text-xs text-slate-400">
                      {tx.date || tx.created_at ? new Date(tx.date || tx.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default InventoryView;