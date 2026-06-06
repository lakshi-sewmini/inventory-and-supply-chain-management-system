import React from 'react';

const SettingView = () => {
  const userRole = localStorage.getItem('userRole');

  return (
    <div className="p-8 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-700">System Settings</h2>
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Profile Info</h3>
          <p className="text-sm text-gray-500 mt-2">Current Role: <span className="font-bold text-[#149393]">{userRole}</span></p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">System Configurations</h3>
          <div className="mt-4 space-y-3">
            <label className="block text-sm font-medium text-gray-600">Language: <b>English (UK)</b></label>
            <label className="block text-sm font-medium text-gray-600">Currency: <b>LKR (Rs.)</b></label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingView;