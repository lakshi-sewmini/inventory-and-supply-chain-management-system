import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SupplierView = () => {
  const [showForm, setShowForm] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
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
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/suppliers`, formData, { headers: { Authorization: `Bearer ${token}` } });
      alert('Supplier Saved Successfully!');
      setShowForm(false);
      fetchSuppliers();
    } catch (err) { alert('Failed to save supplier'); }
  };

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen text-gray-800">
      {!showForm ? (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Suppliers</h2>
              <p className="text-xs text-slate-400 mt-1">Showing 1 to {suppliers.length} of entries</p>
            </div>
            <button onClick={() => setShowForm(true)} className="bg-[#2563eb] hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-sm">+ Add New Supplier</button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-100">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="p-4"># Supplier Code</th>
                  <th className="p-4">Supplier Name</th>
                  <th className="p-4">Contact Person</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {suppliers.map((s, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-bold text-slate-700">{s.supplier_id}</td>
                    <td className="p-4 text-slate-600">{s.name}</td>
                    <td className="p-4 text-slate-500">{s.contact_person}</td>
                    <td className="p-4 text-slate-500">{s.phone || 'N/A'}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600">Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Add/Edit Supplier Form - Photo 11 */
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 max-w-4xl mx-auto">
          <div className="border-b border-slate-100 pb-4 mb-6">
            <h2 className="text-lg font-bold text-slate-800">Add / Edit Supplier</h2>
          </div>
          <form onSubmit={handleSave} className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5"><label className="text-xs font-semibold text-slate-500">Supplier Code</label><input type="text" placeholder="e.g. SUP005" required onChange={e => setFormData({...formData, supplier_id: e.target.value})} className="border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" /></div>
            <div className="flex flex-col space-y-1.5"><label className="text-xs font-semibold text-slate-500">Phone</label><input type="text" placeholder="Enter phone number" required onChange={e => setFormData({...formData, phone: e.target.value})} className="border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" /></div>
            <div className="flex flex-col space-y-1.5"><label className="text-xs font-semibold text-slate-500">Supplier Name</label><input type="text" placeholder="Enter company name" required onChange={e => setFormData({...formData, name: e.target.value})} className="border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" /></div>
            <div className="flex flex-col space-y-1.5"><label className="text-xs font-semibold text-slate-500">Email</label><input type="email" placeholder="Enter email address" required onChange={e => setFormData({...formData, email: e.target.value})} className="border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" /></div>
            <div className="flex flex-col space-y-1.5 col-span-2"><label className="text-xs font-semibold text-slate-500">Contact Person</label><input type="text" placeholder="Enter contact person name" required onChange={e => setFormData({...formData, contact_person: e.target.value})} className="border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" /></div>
            <div className="flex flex-col space-y-1.5 col-span-2"><label className="text-xs font-semibold text-slate-500">Address</label><textarea placeholder="Enter address" rows="2" onChange={e => setFormData({...formData, address: e.target.value})} className="border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500 resize-none"></textarea></div>
            <div className="col-span-2 flex justify-end space-x-3 border-t border-slate-100 pt-4 mt-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-500 hover:bg-slate-50">Cancel</button>
              <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm">Save Supplier</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default SupplierView;