
import React, { useState } from 'react';
import { X, Wallet, Ghost } from 'lucide-react';
import { User } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const handleLogin = () => {
    // Mock Login
    const mockUser: User = {
      id: 'u1',
      username: email.split('@')[0] || 'SeersUser',
      balance: 1250.00
    };
    onLogin(mockUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div className="bg-white rounded-[24px] w-full max-w-[440px] shadow-2xl relative p-8 animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">Welcome to Seers</h2>

        {/* Google Button */}
        <button 
          onClick={handleLogin}
          className="w-full bg-[#4285F4] hover:bg-[#3367D6] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-3 transition-transform active:scale-[0.98] mb-6 shadow-md shadow-blue-200"
        >
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          </div>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px bg-gray-200 flex-1"></div>
          <span className="text-gray-400 text-sm font-medium">OR</span>
          <div className="h-px bg-gray-200 flex-1"></div>
        </div>

        {/* Email Input */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
             <input 
                type="email" 
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 rounded-xl px-4 py-3.5 text-sm outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
             />
          </div>
          <button 
            onClick={handleLogin}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold px-6 py-3.5 rounded-xl text-sm transition-transform active:scale-[0.98]"
          >
            Continue
          </button>
        </div>

        {/* Wallet Icons Row */}
        <div className="grid grid-cols-4 gap-3 mb-8">
            {/* Metamask */}
            <button onClick={handleLogin} className="bg-gray-50 hover:bg-gray-100 rounded-2xl h-14 flex items-center justify-center transition-colors group">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                   <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="Metamask" className="w-5 h-5" />
                </div>
            </button>
            {/* Coinbase */}
            <button onClick={handleLogin} className="bg-gray-50 hover:bg-gray-100 rounded-2xl h-14 flex items-center justify-center transition-colors group">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <div className="w-4 h-4 rounded-full bg-[#0052FF]"></div>
                </div>
            </button>
            {/* Phantom */}
            <button onClick={handleLogin} className="bg-gray-50 hover:bg-gray-100 rounded-2xl h-14 flex items-center justify-center transition-colors group">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Ghost className="w-5 h-5 text-purple-600" />
                </div>
            </button>
            {/* WalletConnect */}
            <button onClick={handleLogin} className="bg-gray-50 hover:bg-gray-100 rounded-2xl h-14 flex items-center justify-center transition-colors group">
                <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Wallet className="w-5 h-5 text-sky-600" />
                </div>
            </button>
        </div>

        {/* Test Bookmaker Button */}
        <button 
          onClick={handleLogin}
          className="w-full border-2 border-orange-500 text-orange-600 hover:bg-orange-50 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
           <span className="text-xl">🏦</span>
           测试庄家模式
        </button>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-400">
          <span className="cursor-pointer hover:text-gray-600">Terms</span>
          <span className="mx-2">•</span>
          <span className="cursor-pointer hover:text-gray-600">Privacy</span>
        </div>

      </div>
    </div>
  );
};
