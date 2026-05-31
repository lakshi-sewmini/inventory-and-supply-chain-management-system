import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import warehouseImg from './assets/background.png'; // මැද තියෙන ගබඩාවේ පින්තූරය

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Submitting Login:", email, password);
  };

  return (
    // මුළු Screen එකම එක පේළියකට බෙදන ප්‍රධාන Container එක
    <div className="flex h-screen w-full bg-white font-sans overflow-hidden">
      
      {/* 1. වම්පස කොටස: SIDEBAR (පළල 18%) */}
      <div className="w-[18%] h-full shrink-0">
        <Sidebar />
      </div>

      {/* 2. මැද කොටස: HERO / BANNER SECTION (පළල 45%) */}
      <div className="w-[45%] h-full shrink-0 bg-[#b9d2e1] flex flex-col justify-between p-12 relative">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 leading-tight">
            Smart Inventory <br /> & Supplychain
          </h1>
          <h2 className="text-3xl font-bold text-[#2b6cb0] mt-1">Management</h2>
          
          <p className="text-gray-600 mt-6 text-sm max-w-sm leading-relaxed">
            Streamline your inventory and supply chain operations in one single system.
          </p>
        </div>
        
        {/* ගබඩාවේ සහ ට්‍රක් රථයේ පින්තූරය */}
        <div className="w-full flex justify-center mt-auto">
          <img 
            src={warehouseImg} 
            alt="Warehouse Operations" 
            className="w-full max-w-md object-contain" 
          />
        </div>
      </div>

      {/* 3. දකුණුපස කොටස: LOGIN FORM SECTION (පළල 37%) */}
      <div className="w-[37%] h-full shrink-0 bg-white flex flex-col justify-center px-12 lg:px-16">
        <div className="w-full max-w-sm mx-auto bg-white p-2">
          
          <h3 className="text-2xl font-bold text-gray-850 mb-1 text-center">Welcome Back!</h3>
          <p className="text-xs text-gray-400 mb-8 text-center font-medium">Please login to your account</p>
          
          {/* Login Form (Input borders සහ focus colors නිවැරදි කර ඇත) */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                User Name/Email
              </label>
              <input 
                type="text" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-[#149393] focus:border-[#149393] bg-gray-50 text-sm text-gray-800"
                placeholder="Enter username or email"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Password
              </label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-[#149393] focus:border-[#149393] bg-gray-50 text-sm text-gray-800"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="text-right">
              <a href="#forgot" className="text-xs font-bold text-pink-500 hover:text-pink-600 hover:underline">
                Forgot Password
              </a>
            </div>

            {/* Login Button */}
            <button 
              type="submit" 
              className="w-full bg-[#149393] hover:bg-[#117c7c] text-white font-bold py-2.5 rounded transition-colors uppercase tracking-widest text-xs shadow-md mt-2"
            >
              Login
            </button>
          </form>

          {/* Contact Admin කොටස */}
          <div className="mt-10 text-center">
            <p className="text-xs text-gray-500 font-medium">
              Don't have an account? <br />
              <a href="#contact" className="text-pink-500 font-bold hover:text-pink-600 hover:underline text-xs block mt-1">
                Contact Administrator
              </a>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}

export default App;
     