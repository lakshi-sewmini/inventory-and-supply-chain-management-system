import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';

import DashboardView from './components/Dashboard'; 
import ProductView from './components/ProductView';
import InventoryView from './components/InventoryView';
import SupplierView from './components/SupplierView';
import PurchaseOrdersView from './components/PurchaseOrdersView';
import ReportsView from './components/ReportsView';
import UserView from './components/UserView';
import SettingView from './components/SettingView';
import LoginView from './components/LoginView'; 

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // ⏳ Loading ස්ටේට් එක

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('userRole'); 
    const storedName = localStorage.getItem('userName');

    // 🛡️ 'undefined' කියන String එක වැටීම වැළැක්වීමේ ආරක්ෂාව
    if (token && storedRole && storedRole !== 'undefined') {
      setIsAuthenticated(true);
      setUser({ 
        name: storedName && storedName !== 'undefined' ? storedName : 'User', 
        role: storedRole 
      });

      // 🔄 [FIX]: ලොග් වෙලා ඉන්නේ Supplier නම් එයාට Dashboard පෙන්වන්න බැරි නිසා Default View එක purchase කරනවා
      if (storedRole.toLowerCase() === 'supplier') {
        setCurrentView('purchase');
      }
    } else {
      setIsAuthenticated(false);
    }
    setIsLoading(false); // Loading අවසන්
  }, []);

  const handleLogout = () => {
    // 🔒 ආරක්ෂිතව අදාළ Keys පමණක් ඉවත් කිරීම
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    
    setIsAuthenticated(false);
    setUser(null);
    setCurrentView('dashboard'); 
    alert('Logged out successfully!');
  };

  // 🔐 Use Case Diagram සහ ඔබේ රූල්ස් වලට අනුව Views ආරක්ෂා කිරීම
  const renderView = () => {
    // Backend එකෙන් එන අකුරු (Capital/Simple) ප්‍රශ්න නැති වෙන්න lowercase කරනවා
    const userRole = (user?.role || 'Staff').toLowerCase();

    switch (currentView) {
      case 'dashboard':
        // 📊 Dashboard එක බලන්න පුළුවන් Admin, Manager හෝ Staff ට විතරයි (Supplier ට බැහැ)
        if (userRole === 'supplier') {
          return <PurchaseOrdersView />;
        }
        return <DashboardView userRole={user?.role || 'Staff'} />;

      case 'products':
        // 📦 Products බලන්න පුළුවන් Admin, Manager සහ Staff ට විතරයි
        if (userRole === 'supplier') return <PurchaseOrdersView />;
        return <ProductView />;

      case 'inventory':
        // 🔄 Inventory බලන්න පුළුවන් Admin, Manager, Staff සහ Stock Keeper ට විතරයි
        if (userRole === 'supplier') return <PurchaseOrdersView />;
        return <InventoryView />;

      case 'suppliers':
        // 🏢 Suppliers මෙනු එක Staff ට සහ Admin/Manager ට වැඩ කරයි
        if (userRole === 'supplier') return <PurchaseOrdersView />;
        return <SupplierView />;

      case 'purchase':
        // 🧾 Purchase Orders බලන්න Admin, Manager, Staff සහ Supplier හැමෝටම පුළුවන්
        return <PurchaseOrdersView />;
      
      // Reports බලන්න පුළුවන් Admin සහ Manager දෙන්නටම විතරයි
      case 'reports':
        return (userRole === 'admin' || userRole === 'manager') ? <ReportsView /> : <DashboardView userRole={user?.role || 'Staff'} />;
      
      // Users සහ Settings අයිති Admin ට විතරයි
      case 'users':
        return userRole === 'admin' ? <UserView /> : <DashboardView userRole={user?.role || 'Staff'} />;
      case 'settings':
        return userRole === 'admin' ? <SettingView /> : <DashboardView userRole={user?.role || 'Staff'} />;
      
      default:
        if (userRole === 'supplier') return <PurchaseOrdersView />;
        return <DashboardView userRole={user?.role || 'Staff'} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <LoginView 
        onLoginSuccess={(token, role, name) => {
          // 🛡️ සේව් වීමට පෙර undefined වීම වළක්වන අවසාන පවුර
          const verifiedRole = role || 'Staff'; 
          const verifiedName = name || 'User';

          localStorage.setItem('token', token);
          localStorage.setItem('userRole', verifiedRole); 
          localStorage.setItem('userName', verifiedName);
          
          setUser({ name: verifiedName, role: verifiedRole });
          setIsAuthenticated(true);

          // 🚀 Supplier කෙනෙක් සාර්ථකව ලොග් වුණොත් එයාට කෙලින්ම Purchase Orders ටැබ් එක පෙන්වීම
          if (verifiedRole.toLowerCase() === 'supplier') {
            setCurrentView('purchase');
          } else {
            setCurrentView('dashboard');
          }
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        handleLogout={handleLogout} 
        user={user} 
      />
      <div className="flex-1 pl-64 min-h-screen">
        {renderView()}
      </div>
    </div>
  );
}

export default App;