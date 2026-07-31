import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PurchaseView = () => {
  const [showForm, setShowForm] = useState(false);
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  // Form එකේ text field එකේ පෙන්වන Supplier Name එක තියාගන්න වෙනම state එකක්
  const [selectedSupplierName, setSelectedSupplierName] = useState('');

  const initialFormState = {
    po_number: '',
    order_date: '2026-05-20',
    expected_date: '',
    tax: 0,
    supplier_id: '',
    status: 'Pending',
    items: [{ product_code: '', product_name: '', quantity: 1, unit_price: 0 }]
  };

  const [formData, setFormData] = useState(initialFormState);

  // API Request වලට පහසුවෙන් Token එක සහ Headers ගන්න පොදු helper එකක්
  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    fetchOrders();
    fetchSuppliers();
    fetchProducts();
  }, []);

  // 1. Purchase Orders ලබා ගැනීම (Main Table)
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/purchase-orders`, getHeaders());
      setOrders(res.data);
    } catch (err) {
      console.error("Orders fetching error:", err);
    }
  };

  // 2. Suppliers ලැයිස්තුව ලබා ගැනීම
  const fetchSuppliers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/suppliers`, getHeaders());
      setSuppliers(res.data); 
    } catch (err) {
      console.error("Suppliers fetching error:", err);
    }
  };

  // 3. Products ලැයිස්තුව ලබා ගැනීම
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products`, getHeaders());
      setProducts(res.data); 
    } catch (err) {
      console.error("Products fetching error:", err);
    }
  };

  // Helper function to get Supplier name from id
  const getSupplierName = (id) => {
    if (!id) return '';
    const supplier = suppliers.find(s => s.supplier_id == id || s.id == id);
    return supplier ? supplier.supplier_name : ''; 
  };

  // Form input වෙනස් වන විට handle කිරීම
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Supplier Search Select එක Handle කිරීම
  const handleSupplierSearchChange = (e) => {
    const value = e.target.value;
    setSelectedSupplierName(value);

    const selectedSupplier = suppliers.find(sup => sup.supplier_name === value);
    if (selectedSupplier) {
      setFormData({ ...formData, supplier_id: selectedSupplier.supplier_id });
    } else {
      setFormData({ ...formData, supplier_id: '' });
    }
  };

  // Items වල input වෙනස් වන විට handle කිරීම
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    
    if (field === 'product_name') {
      updatedItems[index]['product_name'] = value;
      
      const selectedProd = products.find(p => p.product_name === value);
      if (selectedProd) {
        updatedItems[index]['product_code'] = selectedProd.product_code;
        updatedItems[index]['unit_price'] = selectedProd.unit_price || 0; 
      } else {
        updatedItems[index]['product_code'] = '';
      }
    } else {
      updatedItems[index][field] = value;
    }
    
    setFormData({ ...formData, items: updatedItems });
  };

  const addItemRow = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { product_code: '', product_name: '', quantity: 1, unit_price: 0 }]
    });
  };

  const removeItemRow = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: updatedItems });
  };

  // PO Approve & Send Email Function
  const handleApproveAndSend = async (id) => {
    const confirmApprove = window.confirm("Are you sure you want to approve this Purchase Order and send the PDF to the supplier via email?");
    
    if (!confirmApprove) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/purchase-orders/approve/${id}`, 
        {}, 
        getHeaders()
      );

      alert(res.data.message || 'PO Approved and email sent to the Supplier successfully!');
      fetchOrders(); 
    } catch (err) {
      console.error("PO Approval error:", err);
      alert(err.response?.data?.message || 'Failed to approve and send purchase order');
    }
  };

  // Save (Create Only)
  const handleSaveOrder = async (e) => {
    e.preventDefault();
    if (!formData.supplier_id) {
      alert('Please select a valid supplier from the list');
      return;
    }

    const invalidItem = formData.items.find(item => !item.product_code);
    if (invalidItem) {
      alert('Please select a valid product for all items.');
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/purchase-orders/store`,
        formData,
        getHeaders()
      );

      alert(res.data.message || 'Order Created Successfully!');
      closeForm();
      fetchOrders(); 
    } catch (err) {
      console.error(err.response?.data);
      alert(err.response?.data?.message || 'Failed to save purchase order');
    }
  };

  // Delete Only
  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this purchase order?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/purchase-orders/delete/${id}`, getHeaders());
        alert('Order Deleted Successfully!');
        fetchOrders();
      } catch (err) {
        console.error(err);
        alert('Failed to delete order');
      }
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedSupplierName('');
    setFormData(initialFormState);
  };

  const calculateTotal = () => {
    const itemsTotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    return itemsTotal + (parseFloat(formData.tax) || 0);
  };

  return (
    <div className="p-4 md:p-6 bg-[#f8fafc] min-h-screen text-gray-800 w-full max-w-full overflow-x-hidden">
      
      <datalist id="supplier-list">
        {suppliers.map(sup => <option key={sup.supplier_id} value={sup.supplier_name} />)}
      </datalist>
      <datalist id="product-list">
        {products.map(p => <option key={p.product_code} value={p.product_name} />)}
      </datalist>

      {!showForm ? (
        /* --- LIST VIEW --- */
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-100 w-full max-w-full overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800 font-sans">Purchase Orders</h2>
            </div>
            <button 
              onClick={() => setShowForm(true)} 
              className="bg-[#2563eb] hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-sm w-full sm:w-auto text-center"
            >
              + Create Purchase Order
            </button>
          </div>

          {/* 💡 මෙන්න මේ Container එකෙන් තමයි Table එක එළියට යන එක වලක්වලා scroll bar එක හදන්නේ */}
          <div className="w-full overflow-x-auto rounded-lg border border-slate-100">
            <table className="w-full text-left border-collapse text-sm table-fixed min-w-[850px]">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="p-4 w-[12%]"># PO Number</th>
                  <th className="p-4 w-[28%]">Supplier Name</th>
                  <th className="p-4 w-[15%]">Order Date</th>
                  <th className="p-4 w-[18%]">Total Amount</th>
                  <th className="p-4 w-[12%]">Status</th>
                  <th className="p-4 w-[15%] text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-4 text-center text-slate-400">No active Purchase Orders found</td>
                  </tr>
                ) : (
                  orders.map((o, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-bold text-slate-700">{o.po_number}</td>
                      <td className="p-4 text-slate-600 font-medium truncate" title={getSupplierName(o.supplier_id) || o.supplier_name}>
                        {getSupplierName(o.supplier_id) || o.supplier_name || o.supplier_id}
                      </td>
                      <td className="p-4 text-slate-500">{o.order_date}</td>
                      <td className="p-4 font-semibold text-slate-700">Rs. {parseFloat(o.total_amount || 0).toLocaleString()}</td>
                      <td className="p-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                          o.status === 'Approved' || o.status === 'Ordered' ? 'bg-emerald-50 text-emerald-600' :
                          o.status === 'Received' ? 'bg-blue-50 text-blue-600' :
                          o.status === 'Cancelled' ? 'bg-rose-50 text-rose-600' :
                          'bg-amber-50 text-amber-600'
                        }`}>
                          {o.status || 'Pending'}
                        </span>
                      </td>
                      {/* Actions බටන්ස් ටික ෂෝක් එකට බැලන්ස් කරලා තියෙනවා */}
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {(o.status === 'Pending' || o.status === 'pending' || !o.status) && (
                            <button 
                              type="button" 
                              onClick={() => handleApproveAndSend(o.id || o.po_number)} 
                              className="text-emerald-700 hover:text-white font-bold text-[10px] px-2 py-1.5 bg-emerald-50 hover:bg-emerald-600 transition-all rounded border border-emerald-200 uppercase tracking-wider"
                            >
                              Approve
                            </button>
                          )}
                          
                          <button 
                            type="button" 
                            onClick={() => handleDeleteClick(o.id || o.po_number || o._id)} 
                            className="text-red-600 hover:text-white font-bold text-[10px] px-2 py-1.5 bg-red-50 hover:bg-red-600 transition-all rounded border border-red-200 uppercase tracking-wider"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* --- CREATE FORM VIEW --- */
        <form onSubmit={handleSaveOrder} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 max-w-4xl mx-auto w-full">
          <div className="border-b border-slate-100 pb-4 mb-6">
            <h2 className="text-lg font-bold text-slate-800">Create Purchase Order</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">PO Number</label>
              <input type="text" name="po_number" value={formData.po_number} onChange={handleInputChange} required placeholder="e.g. PO-1001" className="border border-slate-200 rounded-lg p-2.5 text-sm bg-white" />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">Supplier Name</label>
              <input 
                type="text" 
                list="supplier-list" 
                placeholder="Type to search Supplier..."
                value={selectedSupplierName} 
                onChange={handleSupplierSearchChange}
                required 
                className="border border-slate-200 rounded-lg p-2.5 text-sm bg-white" 
              />
              <input type="hidden" name="supplier_id" value={formData.supplier_id} />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">Order Date</label>
              <input type="date" name="order_date" value={formData.order_date} onChange={handleInputChange} required className="border border-slate-200 rounded-lg p-2.5 text-sm bg-white" />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">Expected Date</label>
              <input type="date" name="expected_date" value={formData.expected_date} onChange={handleInputChange} required className="border border-slate-200 rounded-lg p-2.5 text-sm bg-white" />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">Tax (Rs.)</label>
              <input type="number" name="tax" value={formData.tax} onChange={handleInputChange} min="0" className="border border-slate-200 rounded-lg p-2.5 text-sm bg-white" />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">Status</label>
              <select 
                name="status" 
                value={formData.status} 
                onChange={handleInputChange} 
                className="border border-slate-200 rounded-lg p-2.5 text-sm bg-white font-medium"
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Received">Received</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Dynamic Items Table */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-slate-700 mb-3">Order Items</h3>
            
            <div className="space-y-2">
              {formData.items.map((item, index) => (
                <div key={index} className="flex flex-col md:flex-row md:items-center gap-3 bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                  
                  <div className="flex-1">
                    <input 
                      type="text" 
                      list="product-list" 
                      placeholder="Type product name..."
                      value={item.product_name} 
                      onChange={(e) => handleItemChange(index, 'product_name', e.target.value)}
                      required 
                      className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-white" 
                    />
                  </div>

                  <div className="w-full md:w-24">
                    <input type="number" placeholder="Qty" value={item.quantity} min="1" onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)} required className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-white" />
                  </div>
                  
                  <div className="w-full md:w-32">
                    <input type="number" placeholder="Unit Price" value={item.unit_price} min="0" step="0.01" onChange={(e) => handleItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)} required className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-white" />
                  </div>

                  <div className="w-full md:w-24 text-sm font-semibold text-slate-600 px-1 text-right">
                    Rs. {(item.quantity * item.unit_price).toLocaleString()}
                  </div>
                  
                  {formData.items.length > 1 && (
                    <button type="button" onClick={() => removeItemRow(index)} className="text-red-500 text-xs font-semibold hover:text-red-700 px-2 py-1 bg-red-50 rounded">Remove</button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-3">
              <button type="button" onClick={addItemRow} className="text-xs text-blue-600 font-semibold hover:underline">+ Add Another Item</button>
              
              <div className="text-right text-sm font-bold text-slate-700">
                Gross Total: <span className="text-blue-600 text-base">Rs. {calculateTotal().toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 border-t border-slate-100 pt-4">
            <button type="button" onClick={closeForm} className="px-5 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-500 hover:bg-slate-50">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm">
              Save Order
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PurchaseView;