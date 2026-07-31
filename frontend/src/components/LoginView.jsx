import React, { useState } from 'react';
import axios from 'axios';
import warehouseImg from '../assets/background.png'; 

const LoginView = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // 🛡️ Admin Modal එක පාලනය කරන්න සහ මැසේජ් එක මාරු කරන්න ස්ටේට්ස් දෙකක්
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [modalType, setModalType] = useState('reset'); // 'reset' හෝ 'create'

  // 📝 Support Form එකට අදාළ States
  const [supportEmail, setSupportEmail] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportLoading, setSupportLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        email: email,
        password: password
      });

      if (response.data.token) {
        const token = response.data.token;
        const role = response.data.role || response.data.user?.role;
        const name = response.data.name || response.data.user?.name || 'User';

        localStorage.setItem('token', token);
        localStorage.setItem('userRole', role);
        localStorage.setItem('userName', name);

        onLoginSuccess(token, role, name); 
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message || "Invalid Email or Password!");
      } else {
        setErrorMessage("Cannot connect to Laravel server!");
      }
    } finally {
      setLoading(false); // 💡 typo එක නිවැරදි කරන ලදී (setloading -> setLoading)
    }
  };

  // 📥 Laravel Backend එකට Support Request එක යවන Function එක
  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    setSupportLoading(true);

    // modalType එක අනුව Backend එකට යන string එක තීරණය කිරීම
    const requestTypeString = modalType === 'reset' ? 'Password Reset' : 'Account Creation';

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/support-tickets`, {
        user_email: supportEmail,
        request_type: requestTypeString,
        message: supportMessage
      });

      if (response.data.success) {
        alert(`Success! Your request for ${requestTypeString} has been sent to the IT Admin.`);
        // Form එක clear කර Modal එක වසා දැමීම
        setSupportEmail('');
        setSupportMessage('');
        setShowAdminModal(false);
      }
    } catch (error) {
      console.error("Error submitting support request", error);
      alert("Something went wrong. Please check your backend connection!");
    } finally {
      setSupportLoading(false);
    }
  };

  // 📞 ඇඩ්මින් කනෙක්ට් කරගන්නා බටන් එක ක්ලික් වූ විට ක්‍රියාත්මක වන ෆන්ක්ෂන් එක
  const openAdminContact = (type) => {
    setModalType(type);
    setSupportEmail(''); // කලින් ගහපු දත්ත clear කිරීමට
    setSupportMessage('');
    setShowAdminModal(true);
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
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight leading-tight drop-shadow-sm">
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

            {/* 🔑 Forgot Password ක්ලික් කළ විට ඇඩ්මින් මොඩල් එක ඕපන් වීම */}
            <div className="text-right">
              <button 
                type="button"
                onClick={() => openAdminContact('reset')}
                className="text-sm font-semibold text-red-500 hover:text-red-700 transition-colors bg-transparent border-none cursor-pointer p-0"
              >
                Forgot Password?
              </button>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 bg-[#149393] text-white font-bold text-base rounded-lg shadow-md hover:bg-[#107575] active:scale-[0.99] transition-all uppercase tracking-wider mt-4 disabled:bg-gray-400 cursor-pointer"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* 👥 Account එකක් නැතිව කන්ටැක්ට් ඇඩ්මින් ක්ලික් කළ විට මොඩල් එක ඕපන් වීම */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-400 font-medium">Don't have an account?</p>
            <button 
              type="button"
              onClick={() => openAdminContact('create')}
              className="text-sm font-bold text-red-400 hover:text-red-500 transition-colors mt-1 inline-block bg-transparent border-none cursor-pointer p-0"
            >
              Contact Administrator
            </button>
          </div>
        </div>
      </div>

      {/* 🛡️ [POP-UP MODAL]: ඇතුළත Form එක සජීවීව වැඩ කරන ලෙස සකසා ඇත */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 border border-slate-100 transform scale-100 transition-all">
            
            {/* Header */}
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 text-lg font-bold">
                {modalType === 'reset' ? '🔑' : '👤'}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  {modalType === 'reset' ? 'Password Reset Support' : 'Account Creation Request'}
                </h3>
                <p className="text-xs text-slate-500">Contact system administrator</p>
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSupportSubmit} className="mt-4 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {modalType === 'reset' 
                  ? 'For security reasons, automatic password resets are disabled. Please enter your email and reason to request an override.' 
                  : 'If you are a newly joined staff member or a supplier, please fill out your details to request an account.'
                }
              </p>

              {/* Input Fields */}
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1">
                    {modalType === 'reset' ? 'Registered Email' : 'Your Contact Email'}
                  </label>
                  <input 
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    required
                    placeholder="name@example.com"
                    className="w-full px-3 py-2 bg-slate-50 text-xs text-slate-800 border border-slate-200 rounded-lg focus:outline-none focus:border-[#149393] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1">
                    {modalType === 'reset' ? 'Reason for Override' : 'Full Name & Job Role'}
                  </label>
                  <textarea 
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    required
                    rows="3"
                    placeholder={modalType === 'reset' ? "Briefly explain why you need a reset..." : "E.g., Kamal Perera - Supplier"}
                    className="w-full px-3 py-2 bg-slate-50 text-xs text-slate-800 border border-slate-200 rounded-lg focus:outline-none focus:border-[#149393] transition-all resize-none"
                  ></textarea>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex justify-end space-x-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAdminModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={supportLoading}
                  className={`px-4 py-2 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    modalType === 'reset' ? 'bg-[#149393] hover:bg-[#107575]' : 'bg-emerald-600 hover:bg-emerald-700'
                  } disabled:bg-gray-400`}
                >
                  {supportLoading ? 'Sending...' : 'Submit Request'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};

export default LoginView;