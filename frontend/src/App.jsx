import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import LoginView from './components/LoginView';
import DashboardView from './components/Dashboard'; 
         
 

function App() {
  // 1. මුලින්ම localStorage එකේ token එකක් තිබේදැයි බලන්න. තිබේ නම් 'dashboard' වෙත යන්න.
  const [currentPage, setCurrentPage] = useState(localStorage.getItem('token') ? 'dashboard' : 'login'); 
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || null); 

  // 2. ලොගින් සාර්ථක වූ විට සිදුවන දේ - මෙම ශ්‍රිතය නිවැරදිව අර්ථ දක්වා ඇත
  const handleLoginSuccess = (role) => {
    setUserRole(role); 
    setCurrentPage('dashboard'); 
  };

  // 3. ලොග් අවුට් වීමේදී සිදුවන දේ
  const handleLogout = () => {
    setUserRole(null);
    localStorage.removeItem('token'); 
    localStorage.removeItem('userRole');
    setCurrentPage('login'); 
  };

  return (
    <div className="flex h-screen w-full bg-[#f4f7f6] font-sans overflow-hidden">
      
      {/* සයිඩ්බාර් එක පෙන්වීම */}
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

      {/* ප්‍රධාන අන්තර්ගතය */}
      <div className={currentPage === 'login' ? "w-full h-full" : "w-[82%] h-full"}>
        
        {/* මෙතැනදී handleLoginSuccess ශ්‍රිතය LoginView වෙත යවයි */}
        {currentPage === 'login' && <LoginView onLoginSuccess={handleLoginSuccess} />}
        
        {currentPage === 'dashboard' && <DashboardView userRole={userRole} />}

        
        
        {['user','product','inventory', 'supplier', 'purchase', 'stock', 'setting'].includes(currentPage) && (
          <div className="p-10 text-xl font-bold text-gray-400 h-full flex items-center justify-center">
            ⚙️ {currentPage.toUpperCase()} page is under construction...
          </div>
        )}
      </div>
    </div>
  );
}

export default App;