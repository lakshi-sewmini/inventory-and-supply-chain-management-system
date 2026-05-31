import React from 'react';
import logo from '../assets/logo.png'; // ඔයාගේ ලෝගෝ එක

const Sidebar = () => {
  // සයිඩ්බාර් එකේ තියෙන බටන් ලැයිස්තුව
  const menuItems = [
    'Login', 'Dashboard', 'User', 'Product', 'Inventory', 
    'Supplier', 'Purchase', 'Stock Alerts', 'Setting'
  ];

  return (
    <div className="w-full h-full bg-[#111] text-white flex flex-col items-center py-5 px-3 justify-between font-sans">
      
      {/* 1. ඉහළ කොටස: ලෝගෝ එක සහ බටන්ස් */}
      <div className="w-full flex flex-col items-center flex-grow">
        
        {/* ලෝගෝ එක මැදටම ගන්නා රවුම */}
        <div className="w-24 h-24 bg-white rounded-full mb-6 shadow-lg flex items-center justify-center overflow-hidden p-2">
          <img 
            src={logo} 
            alt="Logo" 
            className="w-full h-full object-contain" 
          />
        </div>
        
        {/* බටන් ලැයිස්තුව - හැම බටන් එකක්ම Login බටන් එක වගේම කොටු හැඩයට හැදේවි */}
        <div className="w-full flex flex-col space-y-2">
          {menuItems.map((item) => (
            <button 
              key={item} 
              className="w-full py-2 px-3 text-left rounded-none text-xs font-bold bg-[#e2e8f0] text-black border border-gray-400 shadow-sm transition-all hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#149393] focus:border-[#149393]"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* 2. LOGOUT බටන් එක - මේකත් ඒ විදිහටම සකස් කර ඇත */}
      <div className="w-full pt-3 border-t border-gray-850">
        <button className="w-full py-2 px-3 text-left rounded-none text-xs font-bold bg-[#e2e8f0] text-black border border-gray-400 shadow-sm transition-all hover:bg-white uppercase tracking-wider">
          logout
        </button>
      </div>

    </div>
  );
};

export default Sidebar;
