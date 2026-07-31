import React from 'react';
// 🖼️ assets ෆෝල්ඩර් එක ඇතුළේ තියෙන logo.png එක import කිරීම
import logoImg from '../assets/logo.png'; 

const Sidebar = ({ currentView, setCurrentView, handleLogout, user }) => {
  
  // 📋 නිවැරදි කරන ලද මෙනු ලැයිස්තුව (Business Logic & Space Bug Fixed)
  const allMenuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', roles: ['Admin', 'Manager', 'StockKeeper', 'Staff'] },
  { id: 'products', label: 'Products', icon: '📦', roles: ['Admin', 'Manager', 'StockKeeper', 'Staff'] }, 
  { id: 'inventory', label: 'Stock In / Out', icon: '🔄', roles: ['Admin', 'Manager', 'StockKeeper','staff'] },
  { id: 'suppliers', label: 'Suppliers', icon: '🏢', roles: ['Admin', 'Manager'] },
  { id: 'purchase', label: 'Purchase Orders', icon: '🧾', roles: ['Admin', 'Manager'] },
  { id: 'reports', label: 'Reports', icon: '📈', roles: ['Admin', 'Manager'] },
  { id: 'users', label: 'Users', icon: '👥', roles: ['Admin'] },
  { id: 'settings', label: 'Settings', icon: '⚙️', roles: ['Admin'] },
  { id: 'tickets', label: 'Support Requests', icon: '🛡️', roles: ['Admin'] },
];

  //  ලොග් වෙලා ඉන්න යූසර්ගේ Role එක අනුව Button List එක හරියටම Filter කිරීම
  const allowedMenuItems = allMenuItems.filter(item => {
    const rawRole = user?.role || 'Staff';
    
    //  database එකෙන් 'Stock Keeper', 'stock_keeper' හෝ 'stockkeeper' ආවත් Bug එකක් නොවී check කිරීමට
    const cleanRole = rawRole.replace(/[\s_]/g, '').toLowerCase(); 
    
    //Admin ට හැමදේම පේනවා
    if (cleanRole === 'admin') return true;
    
    // අදාළ Array එක ඇතුළේ Role එක තියෙනවාද කියා සසඳයි
    return item.roles.some(role => role.replace(/[\s_]/g, '').toLowerCase() === cleanRole);
  });

  return (
    <div className="w-64 bg-[#0b1329] text-slate-200 h-screen flex flex-col justify-between fixed left-0 top-0 shadow-2xl z-50">
      <div>
        {/* 🏢 උඩ Header කොටස - Logo එක Circle Shape එකට හදලා තියෙන්නේ */}
        <div className="p-5 border-b border-slate-800 flex items-center space-x-3 bg-[#080d1a]">
          <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-br from-indigo-500 to-blue-400 shadow-md shadow-indigo-500/30">
            <div className="w-full h-full rounded-full overflow-hidden bg-slate-800 flex items-center justify-center">
              <img 
                src={logoImg} 
                alt="Logo" 
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  // 🛡️ වැරදිලාවත් Path එකක් අවුල් ගියොත් පරණ 'INV' එක රවුම් කොටුවක් ඇතුළේ පෙන්වනවා
                  e.target.style.display = 'none';
                  e.target.parentNode.innerText = 'INV';
                  e.target.parentNode.className = "bg-gradient-to-br from-indigo-500 to-blue-400 text-white rounded-full font-bold text-xs shadow-md flex items-center justify-center w-full h-full";
                }}
              />
            </div>
          </div>
          <div>
            <h2 className="font-bold text-white text-sm tracking-wide">Smart Inventory</h2>
            <p className="text-[10px] font-bold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">Management</p>
          </div>
        </div>

        {/* 🧭 Navigation Menu Area */}
        <nav className="p-4 space-y-1.5 mt-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {allowedMenuItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <span className={`text-sm ${isActive ? 'scale-110' : ''}`}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* 🚪 Log Out Button */}
          <div className="pt-4 mt-2 border-t border-slate-800/60">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center space-x-3.5 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 cursor-pointer"
            >
              <span className="text-sm">🚪</span>
              <span>Log Out</span>
            </button>
          </div>
        </nav>
      </div>

      {/* 👤 පහළින් පෙනෙන User Profile Section එක */}
      <div className="p-4 border-t border-slate-800 bg-[#080d1a]">
        <div className="flex items-center space-x-3 px-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-400 flex items-center justify-center text-xs font-bold text-white shadow-md shadow-indigo-500/20">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">{user?.name || 'Loading...'}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">
              {user?.role || 'User'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;