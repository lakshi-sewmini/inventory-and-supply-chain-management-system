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
import AdminTickets from "./components/AdminTickets"; 
import PublicPOTracking from "./components/PublicPOTracking"; // 🌐 1. Public View එක import කරගන්නවා

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // 🌐 2. Public Tracking ලින්ක් එකක්ද කියලා බලාගන්න State දෙකක්
  const [isPublicRoute, setIsPublicRoute] = useState(false);
  const [publicToken, setPublicToken] = useState('');

  useEffect(() => {
    // 🌐 3. URL එක චෙක් කරනවා සප්ලයර්ගේ Magic Link එකක්ද කියලා
    // උදා: http://localhost:5173/public/po-tracking/XYZ_TOKEN
    const path = window.location.pathname; 
    if (path.startsWith('/public/po-tracking/')) {
      const tokenFromUrl = path.split('/public/po-tracking/')[1];
      if (tokenFromUrl) {
        setIsPublicRoute(true);
        setPublicToken(tokenFromUrl);
        setIsLoading(false);
        return; // මේක public route එකක් නම් ලොගින් චෙක් කරන්න ඕන නෑ, මෙතනින් නතර කරනවා
      }
    }

    // 🔒 සාමාන්‍ය ඇඩ්මින්/ස්ටාෆ් ලොගින් චෙක් කිරීම
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('userRole'); 
    const storedName = localStorage.getItem('userName');

    if (token && storedRole && storedRole !== 'undefined') {
      setIsAuthenticated(true);
      setUser({ 
        name: storedName && storedName !== 'undefined' ? storedName : 'User', 
        role: storedRole 
      });

      if (storedRole.toLowerCase() === 'supplier') {
        setCurrentView('purchase');
      }
    } else {
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    
    setIsAuthenticated(false);
    setUser(null);
    setCurrentView('dashboard'); 
    alert('Logged out successfully!');
  };

  const renderView = () => {
    const userRole = (user?.role || 'Staff').toLowerCase();

    switch (currentView) {
      case 'dashboard':
        if (userRole === 'supplier') {
          return <PurchaseOrdersView />;
        }
        return <DashboardView userRole={user?.role || 'Staff'} />;

      case 'products':
        if (userRole === 'supplier') return <PurchaseOrdersView />;
        return <ProductView user={user} />;

case 'inventory':
  if (userRole === 'supplier') return <PurchaseOrdersView />;
  // 💡 මෙතනට user={{ role: userRole }} එකතු කරන්න
  return <InventoryView user={{ role: userRole }} />;

      case 'suppliers':
        if (userRole === 'supplier') return <PurchaseOrdersView />;
        return <SupplierView />;

      case 'purchase':
        return <PurchaseOrdersView />;
      
      case 'reports':
        return (userRole === 'admin' || userRole === 'manager') ? <ReportsView /> : <DashboardView userRole={user?.role || 'Staff'} />;
      
      case 'tickets':
        return userRole === 'admin' ? <AdminTickets /> : <DashboardView userRole={user?.role || 'Staff'} />;

      case 'users':
        return userRole === 'admin' ? <UserView /> : <DashboardView userRole={user?.role || 'Staff'} />;
      case 'settings':
        return userRole === 'admin' ? <SettingView /> : <DashboardView userRole={user?.role || 'Staff'} />;
      
      default:
        if (userRole === 'supplier') return <PurchaseOrdersView />;
        return <DashboardView userRole={user?.role || 'Staff'} />;
    }
  };

  // Loading Screen
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 🌐 4. [වැදගත්ම කොටස]: Public route එකක් නම් සයිඩ්බාර් නැතුව කෙලින්ම සප්ලයර් පේජ් එක විතරක් රෙන්ඩර් කරනවා
  if (isPublicRoute) {
    return <PublicPOTracking token={publicToken} />;
  }

  // ලොගින් වී නොමැති නම් ලොගින් පේජ් එක
  if (!isAuthenticated) {
    return (
      <LoginView 
        onLoginSuccess={(token, role, name) => {
          const verifiedRole = role || 'Staff'; 
          const verifiedName = name || 'User';

          localStorage.setItem('token', token);
          localStorage.setItem('userRole', verifiedRole); 
          localStorage.setItem('userName', verifiedName);
          
          setUser({ name: verifiedName, role: verifiedRole });
          setIsAuthenticated(true);

          if (verifiedRole.toLowerCase() === 'supplier') {
            setCurrentView('purchase');
          } else {
            setCurrentView('dashboard');
          }
        }} 
      />
    );
  }

  // සාමාන්‍ය ඇඩ්මින් ඩෑෂ්බෝඩ් එක (සයිඩ්බාර් එකත් එක්ක)
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