
import React, { useState, useEffect } from 'react';
import { X, ChevronRight, AlertCircle, CheckCircle2, Wallet, Plus, Minus } from 'lucide-react';
import { Market, Outcome, User } from '../types';

interface BetModalProps {
  isOpen: boolean;
  onClose: () => void;
  market: Market;
  outcome: Outcome;
  user: User | null;
  onPlaceBet: (marketId: string, outcomeId: string, amount: number) => void;
}

export const BetModal: React.FC<BetModalProps> = ({ isOpen, onClose, market, outcome, user, onPlaceBet }) => {
  const [amount, setAmount] = useState<string>('50');
  const [view, setView] = useState<'betting' | 'success' | 'insufficient'>('betting');
  const BALANCE = user ? user.balance : 0;
  
  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
        setView('betting');
        setAmount('50');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const numAmount = parseFloat(amount) || 0;
  
  // Calculations
  const totalReturn = numAmount * outcome.odds;
  const profit = totalReturn - numAmount;

  const handleAdjustAmount = (delta: number) => {
    const current = parseFloat(amount) || 0;
    const next = Math.max(0, current + delta);
    setAmount(parseFloat(next.toFixed(2)).toString());
  };

  const handleConfirm = () => {
      if (numAmount <= 0) return;
      if (numAmount > BALANCE) {
          setView('insufficient');
      } else {
          // Place the bet globally
          onPlaceBet(market.id, outcome.id, numAmount);
          setView('success');
      }
  };

  const handleRecharge = () => {
      // Logic to jump to recharge page would go here
      alert("跳转至充值页面...");
      onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      {/* Modal Card */}
      <div className="bg-white rounded-[32px] w-full max-w-sm shadow-2xl relative overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 min-h-[500px]">
        
        {/* Header Section */}
        <div className="bg-gradient-to-br from-[#3b82f6] to-[#4f46e5] px-6 pt-6 pb-8 text-white relative shrink-0">
            <button 
                onClick={onClose} 
                className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
            >
                <X className="w-6 h-6" />
            </button>

            <div className="text-sm font-medium text-blue-100 mb-1">
                {view === 'betting' ? '正在投注' : view === 'success' ? '投注成功' : '余额不足'}
            </div>
            <h3 className="font-bold text-lg leading-tight mb-6 pr-8 line-clamp-2">{market.title}</h3>
            
            {/* Selected Outcome Card */}
            <div className="bg-white/10 border border-white/20 rounded-2xl p-4 flex items-center gap-4 backdrop-blur-md">
                <div className="bg-white text-blue-600 font-black text-2xl px-4 py-2 rounded-xl min-w-[80px] text-center shadow-sm">
                    {outcome.odds.toFixed(2)}
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="text-xs text-blue-100 mb-0.5 truncate">您选择的选项</span>
                    <span className="font-bold text-lg leading-none truncate">{outcome.label}</span>
                </div>
            </div>
        </div>

        {/* Body Section */}
        <div className="p-6 bg-white flex-1 flex flex-col">
            
            {view === 'betting' && (
                <>
                    {/* Amount Input Label */}
                    <div className="flex justify-between items-end mb-3">
                        <span className="font-bold text-gray-900 text-sm">投注金额 (USDC)</span>
                        <div className="text-xs text-gray-500 font-medium">
                            <span className="mr-1">余额</span>
                            <span className={`font-bold ${numAmount > BALANCE ? 'text-red-500' : 'text-gray-900'}`}>${BALANCE.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Amount Stepper */}
                    <div className="flex items-center gap-3 mb-5">
                        <button 
                            onClick={() => handleAdjustAmount(-1)}
                            className="w-14 h-14 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors active:scale-95 shrink-0"
                        >
                            <Minus className="w-6 h-6" />
                        </button>
                        
                        <div className="relative flex-1 group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-lg">$</div>
                            <input 
                                type="number" 
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className={`w-full pl-8 pr-4 py-3.5 rounded-xl border text-center text-2xl font-bold text-gray-900 focus:outline-none focus:ring-4 transition-all placeholder:text-gray-300 bg-white ${
                                    numAmount > BALANCE 
                                    ? 'border-red-200 focus:border-red-500 focus:ring-red-500/10' 
                                    : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/10'
                                }`}
                            />
                        </div>

                        <button 
                            onClick={() => handleAdjustAmount(1)}
                            className="w-14 h-14 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors active:scale-95 shrink-0"
                        >
                            <Plus className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Quick Adjustments */}
                    <div className="grid grid-cols-3 gap-3 mb-8">
                        {[-100, 10, 100, 500, 1000, 5000].map(delta => (
                            <button 
                                key={delta}
                                onClick={() => handleAdjustAmount(delta)}
                                className={`py-2.5 rounded-xl text-sm font-bold transition-all ${
                                    delta > 0 
                                    ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700' 
                                    : 'bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700'
                                }`}
                            >
                                {delta > 0 ? (delta >= 1000 ? `+${delta/1000}k` : `+${delta}`) : delta}
                            </button>
                        ))}
                    </div>

                    {/* Calculation Stats */}
                    <div className="bg-gray-50/80 rounded-2xl p-6 mb-6 mt-auto">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-500 text-sm font-medium">预计利润</span>
                            <span className="text-2xl font-bold text-[#2563eb]">${profit.toFixed(2)}</span>
                        </div>
                        <div className="h-px bg-gray-200/60 mb-4 w-full"></div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm font-medium">预计总回报</span>
                            <span className="text-2xl font-bold text-[#16a34a]">${totalReturn.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Confirm Button */}
                    <button 
                        onClick={handleConfirm}
                        disabled={numAmount <= 0}
                        className={`w-full font-bold text-lg py-4 rounded-2xl shadow-lg transition-transform active:scale-[0.98] flex items-center justify-center gap-1 ${
                            numAmount <= 0
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                                : 'bg-[#4f46e5] hover:bg-[#4338ca] text-white shadow-indigo-200'
                        }`}
                    >
                        {numAmount <= 0 ? '请输入金额' : '确认下单'}
                        {numAmount > 0 && <ChevronRight className="w-5 h-5 stroke-[3]" />}
                    </button>
                </>
            )}

            {view === 'success' && (
                <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">投注成功!</h4>
                    <p className="text-gray-500 mb-8 max-w-[200px]">
                        您已成功下注 <span className="font-bold text-gray-900">${numAmount}</span>
                    </p>
                    <button 
                        onClick={onClose}
                        className="w-full bg-gray-900 hover:bg-black text-white font-bold text-lg py-4 rounded-2xl shadow-lg transition-transform active:scale-[0.98]"
                    >
                        完成
                    </button>
                </div>
            )}

            {view === 'insufficient' && (
                <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 relative">
                        <Wallet className="w-8 h-8 text-red-500" />
                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
                            <AlertCircle className="w-6 h-6 text-red-600 fill-white" />
                        </div>
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">余额不足</h4>
                    <p className="text-gray-500 mb-8 max-w-[240px]">
                        您的账户余额为 <span className="font-bold text-gray-900">${BALANCE.toFixed(2)}</span>，不足以支付本次投注。
                    </p>
                    <div className="w-full space-y-3">
                        <button 
                            onClick={handleRecharge}
                            className="w-full bg-[#4f46e5] hover:bg-[#4338ca] text-white font-bold text-lg py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-transform active:scale-[0.98]"
                        >
                            立即充值
                        </button>
                        <button 
                            onClick={() => setView('betting')}
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-lg py-4 rounded-2xl transition-colors"
                        >
                            返回修改金额
                        </button>
                    </div>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};
