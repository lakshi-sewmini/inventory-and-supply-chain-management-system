import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

// 🎨 Design tokens for this view
const CATEGORY_PALETTE = [
  { bg: 'bg-indigo-50', text: 'text-indigo-700', dot: 'bg-indigo-500' },
  { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  { bg: 'bg-teal-50', text: 'text-teal-700', dot: 'bg-teal-500' },
  { bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-500' },
  { bg: 'bg-violet-50', text: 'text-violet-700', dot: 'bg-violet-500' },
  { bg: 'bg-cyan-50', text: 'text-cyan-700', dot: 'bg-cyan-500' },
  { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500' },
];

const hashToIndex = (str, mod) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash % mod;
};

// 💡 1. App.js එකෙන් එවන user prop එක මෙතනින් ලබාගන්නවා
const ProductView = ({ user }) => {
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 💡 2. ලොග් වී සිටින පරිශීලකයා Staff ද කියා පරීක්ෂා කිරීම
  const isStaff = user?.role?.toLowerCase() === 'staff';

  const initialFormState = {
    product_code: '',
    product_name: '',
    brand: '',
    category_id: '',
    category_name: '',
    unit_price: '',
    quantity: 0,
    reorder_level: 10,
    description: '',
    status: 'Active'
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getCategoryName = (product) => {
    if (product.category && product.category.category_name) {
      return product.category.category_name;
    }
    const category = categories.find(c => String(c.category_id) === String(product.category_id));
    return category ? category.category_name : 'N/A';
  };

  const getCategoryStyle = (name) => {
    if (!name || name === 'N/A') return { bg: 'bg-slate-100', text: 'text-slate-500', dot: 'bg-slate-400' };
    return CATEGORY_PALETTE[hashToIndex(name, CATEGORY_PALETTE.length)];
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (isStaff) return; // 🛡️ Staff නම් සේව් කිරීම backend එකෙන් මෙන්ම frontend එකෙන්ද වලක්වයි
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');

      let finalCategoryId = formData.category_id;
      const existingCategory = categories.find(
        c => c.category_name.toLowerCase() === formData.category_name.trim().toLowerCase()
      );

      if (existingCategory) {
        finalCategoryId = existingCategory.category_id;
      } else {
        finalCategoryId = 'CAT-' + formData.category_name.trim().toUpperCase().replace(/\s+/g, '-');
      }

      const dataToSend = {
        ...formData,
        category_id: finalCategoryId,
      };

      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/products/store`, dataToSend, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setShowForm(false);
      setFormData(initialFormState);
      fetchProducts();
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error saving product.');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredProducts = useMemo(
    () => products.filter(p => p.product_name?.toLowerCase().includes(searchTerm.toLowerCase())),
    [products, searchTerm]
  );

  const lowStockCount = useMemo(
    () => products.filter(p => (p.quantity || 0) <= (p.reorder_level || 10)).length,
    [products]
  );

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen text-gray-800">
      {!showForm ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Products</h2>
              <p className="text-xs text-slate-400 mt-1">
                {isLoading ? 'Loading catalog…' : `${products.length} products`}
                {!isLoading && lowStockCount > 0 && (
                  <span className="text-amber-600 font-medium"> · {lowStockCount} below reorder level</span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search products…"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all w-full sm:w-64"
                />
              </div>
              
              {/* 🛡️ 3. Staff කෙනෙක් නොවේ නම් පමණක් "Add Product" බොත්තම පෙන්වයි */}
              {!isStaff && (
                <button
                  onClick={() => { setFormData(initialFormState); setShowForm(true); }}
                  className="bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-all shadow-sm whitespace-nowrap flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Product
                </button>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="p-6 pt-4">
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-slate-50 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-slate-600">
                  {searchTerm ? 'No products match your search' : 'No products yet'}
                </p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  {searchTerm ? 'Try a different search term.' : 'Add your first product to start tracking stock and pricing.'}
                </p>
                
                {/* 🛡️ 4. බඩු කිසිවක් නැති වෙලාවට (Empty State) Staff නොවේ නම් පමණක් "+ Add a product" පෙන්වයි */}
                {!searchTerm && !isStaff && (
                  <button
                    onClick={() => { setFormData(initialFormState); setShowForm(true); }}
                    className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    + Add a product
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-slate-100">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wide">
                      <th className="p-4">#</th>
                      <th className="p-4">Product Code</th>
                      <th className="p-4">Product Name</th>
                      <th className="p-4">Category</th>
                      <th className="p-4 text-right">Unit Price (Rs.)</th>
                      <th className="p-4 text-right">Stock Qty</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((p, i) => {
                      const catName = getCategoryName(p);
                      const catStyle = getCategoryStyle(catName);
                      const isLow = (p.quantity || 0) <= (p.reorder_level || 10);
                      return (
                        <tr key={p.product_id || i} className="hover:bg-slate-50/60 transition-colors">
                          <td className="p-4 text-slate-400">{i + 1}</td>
                          <td className="p-4 font-mono text-xs font-semibold text-slate-700">{p.product_code}</td>
                          <td className="p-4">
                            <div className="font-medium text-slate-700">{p.product_name}</div>
                            {p.brand && <div className="text-xs text-slate-400 mt-0.5">{p.brand}</div>}
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${catStyle.bg} ${catStyle.text}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${catStyle.dot}`} />
                              {catName}
                            </span>
                          </td>
                          <td className="p-4 text-right font-medium text-slate-700 tabular-nums">
                            {parseFloat(p.unit_price || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="p-4 text-right tabular-nums">
                            <span className={`font-semibold ${isLow ? 'text-amber-600' : 'text-slate-600'}`}>
                              {p.quantity || 0}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${p.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                              {p.status || 'Active'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Form Layout - 🛡️ වැරදිලාවත් url හෝ state මඟින් Form එකට ආවොත් (ආරක්ෂාවට) */
        isStaff ? setShowForm(false) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 max-w-3xl mx-auto overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Add Product</h2>
                <p className="text-xs text-slate-400 mt-0.5">Fill in the details below to add it to your catalog.</p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                aria-label="Close form"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6">
              {/* Section: Identity */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Identity</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">Product Code</label>
                    <input
                      type="text"
                      placeholder="e.g. P012"
                      required
                      value={formData.product_code}
                      onChange={e => setFormData({ ...formData, product_code: e.target.value })}
                      className="border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all"
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">Brand (Optional)</label>
                    <input
                      type="text"
                      placeholder="Enter brand"
                      value={formData.brand}
                      onChange={e => setFormData({ ...formData, brand: e.target.value })}
                      className="border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all"
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5 col-span-2">
                    <label className="text-xs font-semibold text-slate-500">Product Name</label>
                    <input
                      type="text"
                      placeholder="Enter product name"
                      required
                      value={formData.product_name}
                      onChange={e => setFormData({ ...formData, product_name: e.target.value })}
                      className="border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all"
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5 col-span-2">
                    <label className="text-xs font-semibold text-slate-500">Category</label>
                    <input
                      type="text"
                      list="category-list"
                      placeholder="Type or select a category"
                      required
                      value={formData.category_name}
                      onChange={e => setFormData({ ...formData, category_name: e.target.value })}
                      className="border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all"
                    />
                    <datalist id="category-list">
                      {categories.map((cat) => (
                        <option key={cat.category_id} value={cat.category_name} />
                      ))}
                    </datalist>
                  </div>
                </div>
              </div>

              {/* Section: Pricing & Stock */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Pricing & Stock</p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">Unit Price (Rs.)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      required
                      value={formData.unit_price}
                      onChange={e => setFormData({ ...formData, unit_price: e.target.value })}
                      className="border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all"
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">Initial Stock Qty</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={formData.quantity}
                      onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                      className="border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all"
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">Reorder Level</label>
                    <input
                      type="number"
                      placeholder="10"
                      value={formData.reorder_level}
                      onChange={e => setFormData({ ...formData, reorder_level: e.target.value })}
                      className="border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Section: Details */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Details</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">Status</label>
                    <select
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value })}
                      className="border border-slate-200 rounded-lg p-2.5 text-sm outline-none bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold shadow-sm transition-colors flex items-center gap-2"
                >
                  {isSaving && (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  )}
                  {isSaving ? 'Saving…' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        )
      )}
    </div>
  );
};

export default ProductView;