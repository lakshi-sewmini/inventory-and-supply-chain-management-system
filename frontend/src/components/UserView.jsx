import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserView = () => {
  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null); 
  
  const [formData, setFormData] = useState({ 
    user_id: '', 
    name: '', 
    username: '', 
    email: '', 
    role: 'Staff', 
    password: '', 
    password_confirmation: '', 
    status: 'Active' 
  });

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users`, { headers: { Authorization: `Bearer ${token}` } });
      setUsers(Array.isArray(res.data) ? res.data : res.data.users || []);
    } catch (err) { console.error(err); }
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (editingUser) {
        // මෙන්න මෙතන editingUser.id වෙනුවට editingUser.user_id පාවිච්චි කළ යුතුය
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/users/${editingUser.user_id}`, formData, { headers: { Authorization: `Bearer ${token}` } });
        alert("User updated successfully!");
      } else {
        // අලුතින් එකතු කිරීම (Register)
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/users/register`, formData, { headers: { Authorization: `Bearer ${token}` } });
        alert("User registered successfully!");
      }
      setShowForm(false);
      setEditingUser(null);
      fetchUsers();
    } catch (err) { alert(err.response?.data?.message || "Operation failed"); }
  };

  const startEdit = (user) => {
    setEditingUser(user);
    setFormData({ 
      user_id: user.user_id || '', 
      name: user.name, 
      username: user.username || '', 
      email: user.email, 
      role: user.role, 
      password: '', 
      password_confirmation: '', 
      status: user.status 
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        fetchUsers();
      } catch (err) { alert("Delete failed"); }
    }
  };

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen text-gray-800">
      {!showForm ? (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Users</h2>
            </div>
            <div className="flex items-center space-x-3">
              <input type="text" placeholder="Search user..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="px-4 py-2 text-sm border border-slate-200 rounded-lg outline-none w-64" />
              <button onClick={() => { setEditingUser(null); setFormData({ user_id: '', name: '', username: '', email: '', role: 'Staff', password: '', password_confirmation: '', status: 'Active' }); setShowForm(true); }} className="bg-[#2563eb] text-white px-4 py-2 rounded-lg font-medium text-sm">+ Add New User</button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-100">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="p-4">User ID</th>
                  <th className="p-4">Full Name</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase())).map((u, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="p-4 font-medium">{u.user_id}</td>
                    <td className="p-4">{u.name}</td>
                    <td className="p-4">{u.role}</td>
                    <td className="p-4">{u.email}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${u.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="p-4 flex space-x-2">
                      <button onClick={() => startEdit(u)} className="text-blue-600 font-semibold hover:underline">Edit</button>
                      <button onClick={() => handleDelete(u.id)} className="text-red-600 font-semibold hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 max-w-4xl mx-auto">
          <div className="border-b border-slate-100 pb-4 mb-6">
            <h2 className="text-lg font-bold text-slate-800">{editingUser ? "Edit User" : "Add New User"}</h2>
          </div>
          <form onSubmit={handleSaveUser} className="grid grid-cols-2 gap-4">
            
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">User ID</label>
              <input type="text" placeholder="e.g. U001" required value={formData.user_id} onChange={e => setFormData({...formData, user_id: e.target.value})} className="border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">Full Name</label>
              <input type="text" placeholder="Enter full name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">Email</label>
              <input type="email" placeholder="Enter email address" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">Role</label>
              <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="border border-slate-200 rounded-lg p-2.5 text-sm outline-none bg-white">
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Stock Keeper">Stock Keeper</option>
                <option value="Staff">Staff</option>
              </select>
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">Password</label>
              <input type="password" placeholder="Enter password" onChange={e => setFormData({...formData, password: e.target.value})} className="border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">Confirm Password</label>
              <input type="password" placeholder="Confirm password" onChange={e => setFormData({...formData, password_confirmation: e.target.value})} className="border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" />
            </div>

            <div className="col-span-2 flex justify-end space-x-3 border-t border-slate-100 pt-4 mt-2">
              <button type="button" onClick={() => { setShowForm(false); setEditingUser(null); }} className="px-5 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-500 hover:bg-slate-50">Cancel</button>
              <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm">Save User</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserView;