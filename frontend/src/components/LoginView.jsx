import React, { useState } from 'react';
import axios from 'axios';
import warehouseImg from '../assets/background.png'; 

const LoginView = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // එකම එක නිවැරදි handleLogin ශ්‍රිතය
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      // API එකට දත්ත යැවීම (/auth/login වෙත - route එකට අනුව)
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        email: email,
        password: password
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
          localStorage.setItem('userRole', response.data.role);
        onLoginSuccess(response.data.role); 
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message || "Invalid Email or Password!");
      } else {
        setErrorMessage("Cannot connect to Laravel server!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* 🏙️ වම් පැත්තේ කොටස */}
      <div 
        className="w-[55%] h-full p-12 bg-cover bg-center relative flex flex-col justify-between"
        style={{ backgroundImage: `url(${warehouseImg})` }}
      >
        <div className="absolute inset-0 bg-black/5 z-0"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold text-slate-800 leading-tight drop-shadow-sm">
            Smart Inventory <br />
            & Supplychain <br />
            <span className="text-[#149393]">Management</span>
          </h1>
          <p className="text-sm text-gray-600 mt-4 max-w-sm font-medium">
            Streamline your inventory and supply chain operations in one single system.
          </p>
        </div>
        <div className="absolute bottom-8 left-12 z-10 text-xs font-bold tracking-wide select-none">
          <span className="text-slate-700 font-extrabold">© 2026</span>{' '}
          <span className="text-[#149393] drop-shadow-sm font-black">Smart Inventory System.</span>{' '}
          <span className="text-gray-500 font-medium">All rights reserved.</span>
        </div>
      </div>

      {/* 🔐 දකුණු පැත්තේ කොටස */}
      <div className="w-[45%] h-full bg-[#f8fafc] flex flex-col justify-center px-20 relative z-10">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Welcome Back!</h2>
          <p className="text-gray-500 text-sm mt-2 mb-10">Please login to your account</p>

          {errorMessage && (
            <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-2.5 rounded text-xs mb-5 font-semibold">
              ⚠️ {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">User Name/Email</label>
              <input 
                type="text" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter username or email" 
                className="w-full px-4 py-3 bg-[#f1f5f9] text-gray-800 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#149393]/30 transition-all placeholder-gray-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full px-4 py-3 bg-[#f1f5f9] text-gray-800 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#149393]/30 transition-all placeholder-gray-400"
                required
              />
            </div>
            <div className="text-right">
              <a href="#forgot" className="text-sm font-semibold text-red-500 hover:text-red-700 transition-colors">Forgot Password?</a>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 bg-[#149393] text-white font-bold text-base rounded-lg shadow-md hover:bg-[#107575] active:scale-[0.99] transition-all uppercase tracking-wider mt-4 disabled:bg-gray-400"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-400 font-medium">Don't have an account?</p>
            <a href="#contact" className="text-sm font-bold text-red-400 hover:text-red-500 transition-colors mt-1 inline-block">Contact Administrator</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;