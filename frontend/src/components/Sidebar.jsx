import React from 'react';
import logo from '../assets/logo.png';

const Sidebar = ({ currentPage, setCurrentPage, userRole, onLogout }) => {
  
  const allMenuItems = [
    { name: 'Dashboard', id: 'dashboard', roles: ['Admin', 'Manager', 'Stock Keeper', 'Staff'] },
    { name: 'User', id: 'user', roles: ['Admin'] },
    { name: 'Product', id: 'product', roles: ['Admin', 'Manager'] },
    { name: 'Inventory', id: 'inventory', roles: ['Admin', 'Manager', 'Stock Keeper', 'Staff'] },
    { name: 'Supplier', id: 'supplier', roles: ['Admin', 'Manager'] },
    { name: 'Purchase', id: 'purchase', roles: ['Admin', 'Manager'] },
    { name: 'Stock Alerts', id: 'stock', roles: ['Admin', 'Manager', 'Stock Keeper', 'Staff'] },
    { name: 'Setting', id: 'setting', roles: ['Admin'] }
];

  
  // ලොගින් වූ userRole එක null වුවහොත් හෝ අගයක් නැති වුවහොත් මෙය පරීක්ෂා කරනවා
 
    const currentRole = userRole ? userRole.toString().toLowerCase().trim() : '';
  
  const allowedMenuItems = allMenuItems.filter(item => 
    item.roles.some(role => role.toLowerCase() === currentRole)
  );

  return (
    <div className="w-full h-full bg-[#111] text-white flex flex-col items-center py-5 px-3 justify-between font-sans">
      <div className="w-full flex flex-col items-center flex-grow">
        <div className="w-24 h-24 bg-white rounded-full mb-6 shadow-lg flex items-center justify-center overflow-hidden p-2">
          <img src={logo} alt="Logo" className="w-full h-full object-contain" />
        </div>
        
        <div className="w-full flex flex-col space-y-2">
          {allowedMenuItems.map((item) => (
            <button 
              key={item.id} 
              onClick={() => setCurrentPage(item.id)}
              className={`w-full py-2 px-3 text-left rounded-none text-xs font-bold shadow-sm transition-all border ${
                currentPage === item.id 
                  ? 'bg-white text-black border-white' 
                  : 'bg-[#e2e8f0] text-black border-gray-400 hover:bg-white' 
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full pt-3 border-t border-gray-800">
        <button 
          onClick={onLogout} 
          className="w-full py-2 px-3 text-left rounded-none text-xs font-bold bg-[#e2e8f0] text-black border border-gray-400 shadow-sm hover:bg-white uppercase"
        >
          logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;