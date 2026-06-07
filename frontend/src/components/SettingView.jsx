import React, { useState } from 'react';

const SettingView = () => {
  const [activeTab, setActiveTab] = useState('profile'); // profile or system

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen text-gray-800">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        
        {/* Settings Tab Header */}
        <div className="flex border-b border-slate-100 bg-slate-50/50 p-4 pb-0">
          <button
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
            <form className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-4">Update Profile Credentials</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">Your Full Name</label>
                    <input type="text" placeholder="John Doe" className="border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">Email Address</label>
                    <input type="email" placeholder="john@example.com" className="border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h3 className="text-sm font-bold text-slate-800 mb-4">Change Password</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">Current Password</label>
                    <input type="password" placeholder="••••••••" className="border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">New Password</label>
                    <input type="password" placeholder="••••••••" className="border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">Confirm New Password</label>
                    <input type="password" placeholder="••••••••" className="border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button type="button" onClick={() => alert('Profile updated!')} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm">
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            /* TAB 2: SYSTEM THRESHOLDS INFO */
            <form className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">Global Inventory Rules</h3>
                <p className="text-[11px] text-slate-400 mb-4">Configure system-wide alert metrics and defaults.</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">Default Reorder Level (Qty Threshold)</label>
                    <input type="number" defaultValue="10" className="border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">System Currency Code</label>
                    <input type="text" defaultValue="LKR (Rs.)" className="border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button type="button" onClick={() => alert('System properties updated!')} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm">
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