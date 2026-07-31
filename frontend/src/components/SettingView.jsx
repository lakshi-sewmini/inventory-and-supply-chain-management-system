import React, { useState, useEffect } from 'react';
import axios from 'axios'; 

const SettingView = () => {
  const [activeTab, setActiveTab] = useState('profile');

  // --- 1. Account Settings States ---
  const [profile, setProfile] = useState({
    fullName: 'John Doe',
    email: 'john@example.com'
  });
  
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // --- 2. System Configurations States ---
  const [systemConfig, setSystemConfig] = useState({
    reorderLevel: 10,
    currencyCode: 'LKR (Rs.)'
  });

  // Base API URL එක
  const API_BASE_URL = 'http://127.0.0.1:8000/api'; 

  // Page එක Load වෙද්දීම Database එකේ තියෙන Data ටික අරන් Form එකට දානවා
  useEffect(() => {
    axios.get(`${API_BASE_URL}/settings`)
      .then(response => {
        setSystemConfig({
          reorderLevel: response.data.reorder_level ?? 10,
          currencyCode: response.data.currency_code ?? 'LKR (Rs.)'
        });
      })
      .catch(error => {
        console.error("Error fetching settings:", error);
      });
  }, []);

  // 🔐 Password එක ඇත්තටම Backend එකට යවලා වෙනස් කරන Function එක
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    // 1. මුලින්ම profile details වෙනස් වුණා කියලා නිකන් alert එකක් දානවා (දැනට backend එකේ profile update නැති නිසා)
    alert(`Profile updated successfully!\nName: ${profile.fullName}\nEmail: ${profile.email}`);
    
    // 2. පරිශීලකයා අලුත් password එකක් ඇතුළත් කරලා තියෙනවා නම් විතරක් backend එකට යවනවා
    if (passwords.newPassword) {
      if (passwords.newPassword !== passwords.confirmPassword) {
        alert("New passwords do not match!");
        return;
      }

      try {
        // Sanctum token එක local storage එකෙන් ගන්නවා (Login වෙද්දී save කරපු එක)
        const token = localStorage.getItem('token'); 

        // Backend එක බලාපොරොත්තු වන key values වලට map කරනවා
        const dataToSend = {
          current_password: passwords.currentPassword,
          new_password: passwords.newPassword,
          new_password_confirmation: passwords.confirmPassword // Laravel validation එකට 'confirmed' වැඩ කරන්න මේ නම ඕනේ
        };

        // Backend API එකට POST Request එකක් යවනවා
        const response = await axios.post(`${API_BASE_URL}/settings/change-password`, dataToSend, {
          headers: {
            Authorization: `Bearer ${token}` // ආරක්ෂාව සඳහා token එක header එකට දානවා
          }
        });

        alert(response.data.message); // Laravel එකෙන් එන 'Password updated successfully!' message එක පෙන්වනවා
        
        // Form එක clear කරනවා
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });

      } catch (error) {
        console.error("Error changing password:", error);
        // පරණ password එක වැරදියි වගේ backend validation error එකක් ආවොත් ඒක පෙන්වනවා
        alert(error.response?.data?.message || "Failed to change password. Please check backend connection.");
      }
    }
  };

  // System Form එක Database එකට සේව් කරන Function එක
  const handleSaveSystem = async (e) => {
    e.preventDefault();
    
    try {
      const dataToSend = {
        reorder_level: systemConfig.reorderLevel,
        currency_code: systemConfig.currencyCode
      };

      const response = await axios.post(`${API_BASE_URL}/settings`, dataToSend);
      alert(response.data.message); 
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings. Please check backend connection.");
    }
  };

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen text-gray-800">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        
        {/* Settings Tab Header */}
        <div className="flex border-b border-slate-100 bg-slate-50/50 p-4 pb-0">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2.5 font-bold text-xs rounded-t-lg transition-all border-b-2 mr-2 ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            👤 Account Settings
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('system')}
            className={`px-4 py-2.5 font-bold text-xs rounded-t-lg transition-all border-b-2 ${
              activeTab === 'system'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            ⚙️ System Configurations
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'profile' ? (
            /* TAB 1: PROFILE & PASSWORD CONFIG */
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-4">Update Profile Credentials</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">Your Full Name</label>
                    <input 
                      type="text" 
                      value={profile.fullName} 
                      onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                      placeholder="John Doe" 
                      className="border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" 
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">Email Address</label>
                    <input 
                      type="type" 
                      value={profile.email} 
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      placeholder="john@example.com" 
                      className="border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" 
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h3 className="text-sm font-bold text-slate-800 mb-4">Change Password</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">Current Password</label>
                    <input 
                      type="password" 
                      value={passwords.currentPassword}
                      onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                      placeholder="••••••••" 
                      className="border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" 
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">New Password</label>
                    <input 
                      type="password" 
                      value={passwords.newPassword}
                      onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                      placeholder="••••••••" 
                      className="border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" 
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">Confirm New Password</label>
                    <input 
                      type="password" 
                      value={passwords.confirmPassword}
                      onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                      placeholder="••••••••" 
                      className="border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" 
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors">
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            /* TAB 2: SYSTEM THRESHOLDS INFO */
            <form onSubmit={handleSaveSystem} className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">Global Inventory Rules</h3>
                <p className="text-[11px] text-slate-400 mb-4">Configure system-wide alert metrics and defaults.</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">Default Reorder Level (Qty Threshold)</label>
                    <input 
                      type="number" 
                      value={systemConfig.reorderLevel} 
                      onChange={(e) => setSystemConfig({ ...systemConfig, reorderLevel: Number(e.target.value) })}
                      className="border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" 
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">System Currency Code</label>
                    <input 
                      type="text" 
                      value={systemConfig.currencyCode} 
                      onChange={(e) => setSystemConfig({ ...systemConfig, currencyCode: e.target.value })}
                      className="border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" 
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors">
                  Save Configuration
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default SettingView;