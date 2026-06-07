import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductView = () => {
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    product_code: '', product_name: '', brand: '', unit_price: '', reorder_level: 10, category_id: '', status: 'Active'
  });

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/products`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Product saved successfully!');
      setShowForm(false);
      fetchProducts();
    } catch (err) { alert('Error saving product'); }
  };

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen text-gray-800">
      {!showForm ? (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          {/* Top Header Section */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Products</h2>
              <p className="text-xs text-slate-400 mt-1">Showing 1 to 5 of entries</p>
            </div>
            <div className="flex items-center space-x-3">
              <input 
                type="text" 
                placeholder="Search product..." 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
                className="px-4 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 w-64"
              />
              <button 
                onClick={() => setShowForm(true)} 
                className="bg-[#2563eb] hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-sm flex items-center"
              >
                + Add New Product
              </button>
            </div>
          </div>

          {/* Modern Table */}
          <div className="overflow-x-auto rounded-lg border border-slate-100">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="p-4">#</th>
                  <th className="p-4">Product Code</th>
                  <th className="p-4">Product Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Unit Price (Rs.)</th>
                  <th className="p-4">Stock Qty</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.filter(p => p.product_name.toLowerCase().includes(searchTerm.toLowerCase())).map((p, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 text-slate-400">{i + 1}</td>
                    <td className="p-4 font-semibold text-slate-700">{p.product_code}</td>
                    <td className="p-4 text-slate-600">{p.product_name}</td>
                    <td className="p-4 text-slate-500">{p.brand || 'Electronics'}</td>
                    <td className="p-4 font-medium text-slate-700">{parseFloat(p.unit_price).toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                    <td className="p-4 text-slate-600 font-semibold">{p.quantity || 0}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${p.status === 'Active' || p.quantity > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {p.status || 'Active'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Add/Edit Product Form Layout (Photo 6) */
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 max-w-5xl mx-auto">
          <div className="border-b border-slate-100 pb-4 mb-6">
            <h2 className="text-lg font-bold text-slate-800">Add / Edit Product</h2>
          </div>
          <form onSubmit={handleSave} className="grid grid-cols-3 gap-6">
            <div className="col-span-2 grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-semibold text-slate-500">Product Code</label>
                <input type="text" placeholder="Enter product code" required onChange={e => setFormData({...formData, product_code: e.target.value})} className="border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-semibold text-slate-500">Unit Price (Rs.)</label>
                <input type="number" placeholder="Enter unit price" required onChange={e => setFormData({...formData, unit_price: e.target.value})} className="border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" />
              </div>
              <div className="flex flex-col space-y-1.5 col-span-2">
                <label className="text-xs font-semibold text-slate-500">Product Name</label>
                <input type="text" placeholder="Enter product name" required onChange={e => setFormData({...formData, product_name: e.target.value})} className="border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-semibold text-slate-500">Category</label>
                <select onChange={e => setFormData({...formData, category_id: e.target.value})} className="border border-slate-200 rounded-lg p-2.5 text-sm outline-none bg-white">
                  <option value="">Select Category</option>
                  <option value="1">Electronics</option>
                  <option value="2">Furniture</option>
                </select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-semibold text-slate-500">Reorder Level</label>
                <input type="number" placeholder="Enter reorder level" onChange={e => setFormData({...formData, reorder_level: e.target.value})} className="border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" />
              </div>
              <div className="flex flex-col space-y-1.5 col-span-2">
                <label className="text-xs font-semibold text-slate-500">Description</label>
                <textarea placeholder="Enter product description" rows="3" className="border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500 resize-none"></textarea>
              </div>
            </div>

            {/* Product Image Section */}
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-4 bg-slate-50/50">
              <div className="text-center">
                <svg className="mx-auto h-10 w-10 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <p className="mt-2 text-xs font-semibold text-slate-600">Upload Image</p>
                <p className="text-[10px] text-slate-400 mt-1">PNG, JPG up to 2MB</p>
                <input type="file" className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className="mt-4 inline-block bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs font-medium cursor-pointer hover:bg-slate-50">Choose File</label>
              </div>
            </div>

            <div className="col-span-3 flex justify-end space-x-3 border-t border-slate-100 pt-4 mt-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-500 hover:bg-slate-50">Cancel</button>
              <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm">Save Product</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProductView;