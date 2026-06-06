import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserView = () => {
  // 1. Navigation & Data States
  const [showForm, setShowForm] = useState(false); // Screenshot දෙක අතර මාරු වීමට
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // 2. Form Input States (Screenshot 2026-06-06 031453.png හි Fields)
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    role: 'Staff',
    password: '',
    password_confirmation: '',
    status: 'Active'
  });

  // 3. Backend එකෙන් පරිශීලකයින් (Users) ලබා ගැනීම
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // 4. අලුත් User කෙනෙක්ව සේව් කිරීම (Laravel AuthController/UserController වෙත)
  const handleSaveUser = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.password_confirmation) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/users/register`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert("User registered successfully!");
      setShowForm(false); // ආපහු ලිස්ට් එකට යනවා
      fetchUsers(); // Table එක Refresh කරනවා
      
      // Form එක Reset කිරීම
      setFormData({ name: '', username: '', email: '', role: 'Staff', password: '', password_confirmation: '', status: 'Active' });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save user!");
    }
  };

  // Search filter
  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-[#f4f7f6] min-h-screen font-sans text-gray-800">
      
      {/* ------------------------------- */}
      {/* SCREENSHOT 1: USER LIST VIEW    */}
      {/* ------------------------------- */}
      {!showForm ? (
        <div className="w-full">
          {/* Header Area */}
          <div className="flex justify-between items-start mb-6">
            <div className="bg-gray-300 px-8 py-3 font-bold text-sm border border-gray-400">
              Users
            </div>
            
            <div className="flex flex-col space-y-2 items-end">
              <button 
                onClick={() => setShowForm(true)} 
                className="bg-gray-300 hover:bg-gray-400 px-6 py-2 font-bold text-xs border border-gray-400 shadow-sm transition-all"
              >
                + Add New User
              </button>
              
              <input 
                type="text" 
                placeholder="search" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-300 px-4 py-1.5 text-xs font-bold border border-gray-400 text-center w-48 outline-none"
              />
            </div>
          </div>

          {/* User List Table Workspace */}
          <div className="bg-gray-200 p-6 border border-gray-400">
            <h3 className="font-bold text-sm mb-3">user List</h3>
            
            <div className="bg-white border border-gray-400 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-400 bg-gray-50 text-xs font-bold">
                    <th className="p-3 border-r border-gray-400">Full Name</th>
                    <th className="p-3 border-r border-gray-400">Username</th>
                    <th className="p-3 border-r border-gray-400">Email</th>
                    <th className="p-3 border-r border-gray-400">Role</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-4 text-center text-gray-400 font-semibold bg-white">No Users Found</td>
                    </tr>
                  ) : (
                    filteredUsers.map((user, idx) => (
                      <tr key={idx} className="border-b border-gray-300 bg-white hover:bg-gray-50">
                        <td className="p-3 border-r border-gray-300 font-medium">{user.name}</td>
                        <td className="p-3 border-r border-gray-300">{user.username || 'N/A'}</td>
                        <td className="p-3 border-r border-gray-300">{user.email}</td>
                        <td className="p-3 border-r border-gray-300 font-semibold text-teal-700">{user.role}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-sm font-bold text-[10px] ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {user.status || 'Active'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Pagination Area */}
          <div className="flex justify-between items-center mt-4 text-xs font-bold">
            <div className="bg-gray-300 px-4 py-1.5 border border-gray-400">
              Showing 1 to {filteredUsers.length} of {filteredUsers.length} entities
            </div>
            
            <div className="flex bg-gray-300 border border-gray-400 overflow-hidden">
              <button className="px-3 py-1 border-r border-gray-400 hover:bg-gray-400">&lt;</button>
              <button className="px-3 py-1 border-r border-gray-400 bg-white">1</button>
              <button className="px-3 py-1 border-r border-gray-400 hover:bg-gray-400">2</button>
              <button className="px-3 py-1 hover:bg-gray-400">&gt;</button>
            </div>
          </div>
        </div>
      ) : (

        // ---------------------------------
        // SCREENSHOT 2: ADD NEW USER FORM  
        // ---------------------------------
        <form onSubmit={handleSaveUser} className="w-full bg-gray-200 p-8 border border-gray-400 max-w-4xl mx-auto">
          <div className="bg-white border border-gray-400 px-6 py-2 inline-block font-bold text-sm mb-8">
            Add New User
          </div>

          {/* Input Grid Structure */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-6">
            
            {/* Row 1 */}
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold">Full Name</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="bg-white border border-gray-400 p-2 text-sm outline-none"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold">UserName</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="bg-white border border-gray-400 p-2 text-sm outline-none"
              />
            </div>

            {/* Row 2 */}
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold">Email</label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="bg-white border border-gray-400 p-2 text-sm outline-none"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold">Role</label>
              <select 
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value})}
                className="bg-white border border-gray-400 p-2 text-sm outline-none h-[38px] font-medium"
              >
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Stock Keeper">Stock Keeper</option>
                <option value="Staff">Staff</option>
              </select>
            </div>

            {/* Row 3 */}
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold">Password</label>
              <input 
                type="password" 
                required
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="bg-white border border-gray-400 p-2 text-sm outline-none"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold">Confirm password</label>
              <input 
                type="password" 
                required
                value={formData.password_confirmation}
                onChange={e => setFormData({...formData, password_confirmation: e.target.value})}
                className="bg-white border border-gray-400 p-2 text-sm outline-none"
              />
            </div>

            {/* Row 4 */}
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold">Status</label>
              <select 
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
                className="bg-white border border-gray-400 p-2 text-sm outline-none h-[38px] font-medium"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Action Buttons (Bottom Right alignment style) */}
            <div className="flex items-end justify-end space-x-4 h-full pt-4">
              <button 
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-white hover:bg-gray-100 border border-gray-400 px-6 py-1.5 font-bold text-xs"
              >
                Cancel
              </button>
              
              <button 
                type="submit"
                className="bg-white hover:bg-gray-100 border border-gray-400 px-6 py-1.5 font-bold text-xs"
              >
                Save User
              </button>
            </div>

          </div>
        </form>
      )}
    </div>
  );
};

export default UserView;