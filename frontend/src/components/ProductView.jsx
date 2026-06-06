import React, { useState, useEffect } from 'react';
import API from '../api';

const ProductView = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ product_code: '', product_name: '', brand: '', unit_price: '', category_id: '', status: 'Available' });

  // 1. නිෂ්පාදන ලැයිස්තුව ලබාගැනීම
  const fetchProducts = async () => {
    try {
      const res = await API.get('/products');
      setProducts(res.data);
    } catch (err) { console.error("Error fetching products", err); }
  };

  useEffect(() => { fetchProducts(); }, []);

  // 2. අලුත් නිෂ්පාදනයක් සේව් කිරීම
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/products/store', formData);
      setShowModal(false);
      fetchProducts(); // List එක Refresh කිරීම
      setFormData({ product_code: '', product_name: '', brand: '', unit_price: '', category_id: '', status: 'Available' });
    } catch (err) { alert("Failed to add product!"); }
  };

  return (
    <div className="p-8 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-700">Product Management</h2>
        <button onClick={() => setShowModal(true)} className="bg-[#149393] text-white px-4 py-2 rounded font-bold hover:bg-[#107575]">
          + Add Product
        </button>
      </div>

      {/* Product Table */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-gray-50 text-gray-600 text-sm font-semibold">
              <th className="p-3">Code</th>
              <th className="p-3">Name</th>
              <th className="p-3">Brand</th>
              <th className="p-3">Unit Price</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <tr key={prod.product_code} className="border-b hover:bg-gray-50 text-sm">
                <td className="p-3 font-semibold">{prod.product_code}</td>
                <td className="p-3">{prod.product_name}</td>
                <td className="p-3">{prod.brand}</td>
                <td className="p-3">Rs. {prod.unit_price}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${prod.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {prod.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-gray-700">Add New Product</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Product Code" className="w-full p-2 border rounded" onChange={e => setFormData({...formData, product_code: e.target.value})} required />
              <input type="text" placeholder="Product Name" className="w-full p-2 border rounded" onChange={e => setFormData({...formData, product_name: e.target.value})} required />
              <input type="text" placeholder="Brand" className="w-full p-2 border rounded" onChange={e => setFormData({...formData, brand: e.target.value})} />
              <input type="number" placeholder="Unit Price" className="w-full p-2 border rounded" onChange={e => setFormData({...formData, unit_price: e.target.value})} required />
              <input type="text" placeholder="Category ID" className="w-full p-2 border rounded" onChange={e => setFormData({...formData, category_id: e.target.value})} required />
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setShowModal(false)} className="bg-gray-300 px-4 py-2 rounded text-sm font-bold">Cancel</button>
                <button type="submit" className="bg-[#149393] text-white px-4 py-2 rounded text-sm font-bold">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductView;