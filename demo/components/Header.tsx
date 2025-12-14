
import React, { useState, useRef, useEffect } from 'react';
import { Search, User as UserIcon, Globe, Download, Upload, Plus, LogOut, ChevronDown } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
  onCreateMarket?: () => void;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onCreateMarket, onOpenLogin, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-gray-200">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl leading-none tracking-tight text-gray-900">Seers</span>
            <span className="text-[10px] text-gray-400 font-medium tracking-wide">洞察未来</span>
          </div>
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-xl mx-8 hidden md:block">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-3 border-none rounded-2xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all text-sm font-medium"
              placeholder="搜索预测市场 (例如: NBA, 欧洲杯...)"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          
          {/* Language */}
          <button className="hidden xl:flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-900 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors">
            <Globe className="w-4 h-4" />
            简体中文
          </button>
          
          {user ? (
            <>
                {/* Logged In State */}
                <button className="hidden lg:flex items-center gap-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-900 px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm hover:shadow-md">
                    <Download className="w-4 h-4" />
                    充值
                </button>

                <button className="hidden lg:flex items-center gap-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-900 px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm hover:shadow-md">
                    <Upload className="w-4 h-4" />
                    提现
                </button>

                <button 
                    onClick={onCreateMarket}
                    className="hidden sm:flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-gray-900/20 transition-all active:scale-95 hover:scale-105"
                >
                    <Plus className="w-4 h-4" />
                    创建市场
                </button>
                
                {/* User Dropdown */}
                <div className="pl-2 relative" ref={menuRef}>
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="flex items-center gap-2 hover:bg-gray-50 p-1 pr-2 rounded-full transition-colors"
                    >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-200">
                             <UserIcon className="w-5 h-5" />
                        </div>
                        <ChevronDown className="w-3 h-3 text-gray-400" />
                    </button>

                    {isMenuOpen && (
                        <div className="absolute right-0 top-14 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in slide-in-from-top-2 duration-200">
                             <div className="px-4 py-2 border-b border-gray-50 mb-1">
                                <p className="text-xs text-gray-400">当前用户</p>
                                <p className="font-bold text-gray-900 truncate">{user.username}</p>
                             </div>
                             <div className="px-4 py-2 mb-1">
                                <p className="text-xs text-gray-400">余额</p>
                                <p className="font-bold text-blue-600">${user.balance.toFixed(2)}</p>
                             </div>
                             <button 
                                onClick={() => { onLogout(); setIsMenuOpen(false); }}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium flex items-center gap-2"
                             >
                                <LogOut className="w-4 h-4" />
                                退出登陆
                             </button>
                        </div>
                    )}
                </div>
            </>
          ) : (
            <>
                {/* Logged Out State */}
                <div className="flex items-center gap-2 pl-2">
                    <button 
                        onClick={onOpenLogin}
                        className="text-gray-500 hover:text-gray-900 font-bold text-sm px-4 py-2.5 transition-colors"
                    >
                        登录
                    </button>
                    <button 
                         onClick={onOpenLogin}
                        className="bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-gray-900/20 transition-all active:scale-95 hover:scale-105"
                    >
                        注册
                    </button>
                </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
