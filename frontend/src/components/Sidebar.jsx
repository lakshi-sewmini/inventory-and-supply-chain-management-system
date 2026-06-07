import React from 'react';
// 🖼️ assets ෆෝල්ඩර් එක ඇතුළේ තියෙන logo.png එක නිවැරදිව import කිරීම
import logoImg from '../assets/logo.png'; 

const Sidebar = ({ currentView, setCurrentView, handleLogout, user }) => {
  
  // 📋 Use Case Diagram එකට අනුව නිවැරදි මෙනු සහ අදාළ Roles
  const allMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', roles: ['Admin', 'Manager', 'Staff'] },
    { id: 'products', label: 'Products', icon: '📦', roles: ['Admin', 'Manager'] },
    { id: 'inventory', label: 'Stock In / Out', icon: '🔄', roles: ['Admin', 'Manager', 'Stock Keeper', 'Staff'] },
    { id: 'suppliers', label: 'Suppliers', icon: '🏢', roles: ['Admin', 'Manager'] },
    { id: 'purchase', label: 'Purchase Orders', icon: '🧾', roles: ['Admin', 'Manager', 'Supplier', 'Staff'] },
    { id: 'reports', label: 'Reports', icon: '📈', roles: ['Admin', 'Manager'] },
    { id: 'users', label: 'Users', icon: '👥', roles: ['Admin'] },
    { id: 'settings', label: 'Settings', icon: '⚙️', roles: ['Admin'] },
  ];

  // 🔍 ලොග් වෙලා ඉන්න යූසර්ගේ Role එක අනුව Button List එක හරියටම Filter කිරීම
  const allowedMenuItems = allMenuItems.filter(item => {
    const rawRole = user?.role || 'Staff';
    const currentRole = rawRole.charAt(0).toUpperCase() + rawRole.slice(1).toLowerCase(); 
    
    if (currentRole === 'Admin') return true;
    
    return item.roles.includes(currentRole);
  });

  return (
    <div className="w-64 bg-[#0b1329] text-slate-200 h-screen flex flex-col justify-between fixed left-0 top-0 shadow-2xl z-50">
      <div>
        {/* 🏢 උඩ Header කොටස - Logo එක Circle Shape එකට හදලා තියෙන්නේ */}
        <div className="p-5 border-b border-slate-800 flex items-center space-x-3 bg-[#080d1a]">
          <div className="w-10 h-10 rounded-full border-2 border-blue-500/30 overflow-hidden flex items-center justify-center bg-slate-800 shadow-md shadow-blue-500/10">
            <img 
              src={logoImg} 
              alt="Logo" 
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                // 🛡️ වැරදිලාවත් Path එකක් අවුල් ගියොත් පරණ 'INV' එක රවුම් කොටුවක් ඇතුළේ පෙන්වනවා
                e.target.style.display = 'none';
                e.target.parentNode.innerText = 'INV';
                e.target.parentNode.className = "bg-[#2563eb] text-white rounded-full font-bold text-xs shadow-md flex items-center justify-center w-10 h-10";
              }}
            />
          </div>
          <div>
            <h2 className="font-bold text-white text-sm tracking-wide">Smart Inventory</h2>
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Management</p>
          </div>
        </div>

        <nav className="p-4 space-y-1.5 mt-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {allowedMenuItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer ${
                  isActive ? 'bg-[#2563eb] text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <span className={`text-sm ${isActive ? 'scale-110' : ''}`}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}

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

      <div className="p-4 border-t border-slate-800 bg-[#080d1a]">
        <div className="flex items-center space-x-3 px-2">
          <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">{user?.name || 'Loading...'}</p>
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">{user?.role || 'User'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;