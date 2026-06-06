import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import LoginView from './components/LoginView';
import DashboardView from './components/Dashboard'; 
import UserView from './components/UserView';
import ProductView from './components/ProductView';
import InventoryView from './components/InventoryView';
import SupplierView from './components/SupplierView';
import PurchaseView from './components/PurchaseOrdersView'; 
import StockAlertView from './components/StockAlertsView';
import SettingView from './components/SettingView';

function App() {
  const [currentPage, setCurrentPage] = useState(localStorage.getItem('token') ? 'dashboard' : 'login'); 
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || null); 

  const handleLoginSuccess = (role) => {
    setUserRole(role); 
    setCurrentPage('dashboard'); 
  };

  const handleLogout = () => {
    setUserRole(null);
    localStorage.removeItem('token'); 
    localStorage.removeItem('userRole');
    setCurrentPage('login'); 
  };

  // වත්මන් පිටුවට අනුව අදාළ Component එක තෝරාගැනීම
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': 
        return <DashboardView userRole={userRole} />;
      case 'user': 
        return <UserView />;
      case 'product': 
        return <ProductView />;
      case 'inventory': 
        return <InventoryView />;
      case 'supplier': 
        return <SupplierView />;
        
      // 👈 මෙන්න මේ කොටස් අපි නිවැරදිව යාවත්කාලීන කළා
      case 'purchase': 
        return <PurchaseView />;
        
      case 'stock': // Sidebar එකේ තියෙන්නේ 'stock' කියලා නිසා මේ නම මෙතනට වැදගත් වේ
        return <StockAlertView />;
        
      case 'setting': 
        return <SettingView />;
        
      default: 
        return <DashboardView userRole={userRole} />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#f4f7f6] font-sans overflow-hidden">
      {currentPage !== 'login' && (
        <div className="w-[18%] h-full shrink-0">
          <Sidebar 
            currentPage={currentPage} 
            setCurrentPage={setCurrentPage} 
            userRole={userRole} 
            onLogout={handleLogout} 
          />
        </div>
      )}

      <div className={currentPage === 'login' ? "w-full h-full" : "w-[82%] h-full overflow-y-auto"}>
        {currentPage === 'login' ? (
          <LoginView onLoginSuccess={handleLoginSuccess} />
        ) : (
          renderPage()
        )}
      </div>
    </div>
  );
}

export default App;