import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SupplierView = () => {
  const [showForm, setShowForm] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({ supplier_id: '', name: '', contact_person: '', email: '', phone: '', address: '', status: 'Active' });

  useEffect(() => { fetchSuppliers(); }, []);

  const fetchSuppliers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/suppliers`, { headers: { Authorization: `Bearer ${token}` } });
      setSuppliers(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (editingSupplier) {
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/suppliers/${editingSupplier.supplier_id}`, formData, { headers: { Authorization: `Bearer ${token}` } });
        alert('Supplier Updated Successfully!');
      } else {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/suppliers`, formData, { headers: { Authorization: `Bearer ${token}` } });
        alert('Supplier Saved Successfully!');
      }
      setShowForm(false);
      setEditingSupplier(null);
      setFormData({ supplier_id: '', name: '', contact_person: '', email: '', phone: '', address: '', status: 'Active' });
      fetchSuppliers();
    } catch (err) { alert('Failed to save supplier'); }
  };

  const startEdit = (s) => {
    setEditingSupplier(s);
    setFormData({ supplier_id: s.supplier_id, name: s.supplier_name, contact_person: s.contact_person, email: s.email, phone: s.phone, address: s.address, status: s.status });
    setShowForm(true);
  };

  const handleDelete = async (supplier_id) => {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/suppliers/${supplier_id}`, { headers: { Authorization: `Bearer ${token}` } });
        fetchSuppliers();
      } catch (err) { alert('Failed to delete supplier'); }
    }
  };

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen text-gray-800">
      {!showForm ? (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">Suppliers</h2>
            <button onClick={() => { setEditingSupplier(null); setShowForm(true); }} className="bg-[#2563eb] hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm">+ Add New Supplier</button>
          </div>
          <div className="overflow-x-auto rounded-lg border border-slate-100">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="p-4">Supplier Code</th><th className="p-4">Supplier Name</th><th className="p-4">Contact</th><th className="p-4">Phone</th><th className="p-4">Status</th><th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {suppliers.map((s, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-700">{s.supplier_id}</td>
                    <td className="p-4 text-slate-600">{s.supplier_name}</td>
                    <td className="p-4 text-slate-500">{s.contact_person}</td>
                    <td className="p-4 text-slate-500">{s.phone}</td>
                    <td className="p-4"><span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600">{s.status}</span></td>
                    <td className="p-4 flex space-x-2">
                      <button onClick={() => startEdit(s)} className="text-blue-600 font-bold hover:underline">Edit</button>
                      <button onClick={() => handleDelete(s.supplier_id)} className="text-red-600 font-bold hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 max-w-4xl mx-auto">
          <h2 className="text-lg font-bold text-slate-800 mb-4">{editingSupplier ? "Edit Supplier" : "Add New Supplier"}</h2>
          <form onSubmit={handleSave} className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5"><label className="text-xs font-semibold text-slate-500">Supplier Code</label><input type="text" required value={formData.supplier_id} onChange={e => setFormData({...formData, supplier_id: e.target.value})} className="border rounded-lg p-2.5 text-sm" /></div>
            <div className="flex flex-col space-y-1.5"><label className="text-xs font-semibold text-slate-500">Phone</label><input type="text" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="border rounded-lg p-2.5 text-sm" /></div>
            <div className="flex flex-col space-y-1.5"><label className="text-xs font-semibold text-slate-500">Supplier Name</label><input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="border rounded-lg p-2.5 text-sm" /></div>
            <div className="flex flex-col space-y-1.5"><label className="text-xs font-semibold text-slate-500">Email</label><input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="border rounded-lg p-2.5 text-sm" /></div>
            <div className="flex flex-col space-y-1.5 col-span-2"><label className="text-xs font-semibold text-slate-500">Contact Person</label><input type="text" required value={formData.contact_person} onChange={e => setFormData({...formData, contact_person: e.target.value})} className="border rounded-lg p-2.5 text-sm" /></div>
            <div className="flex flex-col space-y-1.5 col-span-2"><label className="text-xs font-semibold text-slate-500">Address</label><textarea rows="2" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="border rounded-lg p-2.5 text-sm"></textarea></div>
            <div className="col-span-2 flex justify-end space-x-3 pt-4">
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 border rounded-lg text-sm">Cancel</button>
              <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm">Save Supplier</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default SupplierView;