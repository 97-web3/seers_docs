
import React from 'react';
import { Market, Outcome, User } from '../types';
import { Clock, DollarSign, Lock } from 'lucide-react';

interface MarketCardAllProps {
  market: Market;
  onClick: () => void;
  onBet: (outcome: Outcome) => void;
  user?: User | null;
}

const formatNumber = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

const formatDate = (dateStr: string) => {
    try {
        const date = new Date(dateStr);
        if(isNaN(date.getTime())) return dateStr.split(' ')[0]; 
        return `${date.getMonth() + 1}月${date.getDate()}日`;
    } catch (e) {
        return dateStr;
    }
};

export const MarketCardAll: React.FC<MarketCardAllProps> = ({ market, onClick, onBet, user }) => {
  // Use Grid Card layout for 3 or fewer outcomes. 
  // If more than 3, switch to List view.
  const isGrid = market.outcomes.length <= 3;
  
  // For List view, limit visible outcomes.
  const visibleOutcomes = isGrid ? market.outcomes : market.outcomes.slice(0, 3); 
  
  const isOwner = user?.username === market.createdBy;
  const isVsMode = market.teamHomeImage && market.teamAwayImage;

  // Helper to determine color theme based on index and total count
  const getTheme = (index: number, isBookmakerSide: boolean, isOwner: boolean) => {
      // Bookmaker Side styling
      if (isBookmakerSide) {
          if (isOwner) return { bg: 'bg-purple-50', text: 'text-purple-900', bar: 'bg-purple-500', amount: 'text-purple-400', button: 'bg-purple-100 text-purple-700' };
          return { bg: 'bg-gray-50', text: 'text-gray-400', bar: 'bg-gray-300', amount: 'text-gray-300', button: 'bg-gray-100 text-gray-400' };
      }

      // Standard Colors (Green -> Red -> Orange -> Blue)
      const themes = [
          { bg: 'bg-[#ecfdf5]', text: 'text-[#047857]', bar: 'bg-[#10b981]', amount: 'text-[#6ee7b7]', button: 'bg-[#d1fae5] text-[#059669]' }, // Emerald
          { bg: 'bg-[#fff1f2]', text: 'text-[#be123c]', bar: 'bg-[#f43f5e]', amount: 'text-[#fda4af]', button: 'bg-[#ffe4e6] text-[#e11d48]' }, // Rose
          { bg: 'bg-[#fff7ed]', text: 'text-[#c2410c]', bar: 'bg-[#f97316]', amount: 'text-[#fdba74]', button: 'bg-[#ffedd5] text-[#ea580c]' }, // Orange
          { bg: 'bg-[#eff6ff]', text: 'text-[#1d4ed8]', bar: 'bg-[#3b82f6]', amount: 'text-[#93c5fd]', button: 'bg-[#dbeafe] text-[#2563eb]' }, // Blue
      ];
      return themes[index % themes.length];
  };

  return (
    <div 
        onClick={onClick}
        className="bg-white rounded-[20px] p-5 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all cursor-pointer flex flex-col h-full group select-none relative"
    >
      {/* Header: Avatar + Title */}
      <div className="flex gap-3 mb-5 items-start">
        {isVsMode ? (
             <div className="relative w-12 h-10 shrink-0">
                 {/* Team 1 (Left-Top) */}
                 <div className="absolute left-0 top-0 w-7 h-7 rounded-full bg-white border border-gray-100 shadow-sm z-10 flex items-center justify-center overflow-hidden">
                      <img src={market.teamHomeImage} className="w-full h-full object-contain p-0.5" alt="Home" />
                 </div>
                 {/* Team 2 (Right-Bottom) */}
                 <div className="absolute right-0 bottom-0 w-7 h-7 rounded-full bg-white border border-gray-100 shadow-sm z-20 flex items-center justify-center overflow-hidden">
                      <img src={market.teamAwayImage} className="w-full h-full object-contain p-0.5" alt="Away" />
                 </div>
            </div>
        ) : (
            <div className="w-10 h-10 rounded-xl bg-gray-50 shrink-0 overflow-hidden shadow-sm border border-gray-100 relative">
                 <img src={market.image} alt={market.title} className="w-full h-full object-cover" />
            </div>
        )}

        <div className="flex-1 min-w-0 pt-0.5">
             <h3 className="font-bold text-gray-900 text-[14px] leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                {market.title}
             </h3>
        </div>
      </div>

      {/* Content: Outcomes */}
      <div className="flex-1">
         {isGrid ? (
             <div className={`grid ${market.outcomes.length === 3 ? 'grid-cols-3' : 'grid-cols-2'} gap-3 h-full`}>
                 {market.outcomes.map((outcome, idx) => {
                     const isBookmakerSide = market.isUserCreated && market.bookmakerSideId === outcome.id;
                     const theme = getTheme(idx, isBookmakerSide, isOwner);
                     const isDisabled = isBookmakerSide; // Always disabled if bookmaker side
                     const isLocked = isBookmakerSide;

                     return (
                        <div 
                            key={outcome.id} 
                            onClick={(e) => {
                                e.stopPropagation();
                                if (isDisabled) return;
                                onBet(outcome);
                            }}
                            className={`relative rounded-xl p-3 flex flex-col justify-between overflow-hidden transition-all h-24 ${theme.bg} ${isDisabled ? 'cursor-not-allowed opacity-80' : 'hover:scale-[1.02] cursor-pointer'}`}
                        >
                             {/* Top Row: Label */}
                             <div className="flex justify-between items-start mb-1">
                                 <span className={`text-[13px] font-bold leading-tight line-clamp-2 ${theme.text}`}>
                                     {outcome.label}
                                 </span>
                                 {isLocked && <Lock className={`w-3 h-3 ${isBookmakerSide && !isOwner ? 'text-gray-400' : 'text-purple-500'}`} />}
                             </div>

                             {/* Bottom Row: Data */}
                             <div className="mt-auto">
                                 <div className="flex justify-between items-end mb-1.5">
                                    <span className={`text-lg font-bold leading-none ${theme.text}`}>
                                        {outcome.betCountPercentage}%
                                    </span>
                                    <span className={`text-[10px] font-medium ${isBookmakerSide ? 'text-gray-400' : 'text-gray-400/80'}`}>
                                        ${formatNumber(outcome.totalAmount)}
                                    </span>
                                 </div>
                                 
                                 {/* Progress Bar */}
                                 <div className="w-full h-1.5 bg-black/5 rounded-full overflow-hidden">
                                     <div 
                                        className={`h-full rounded-full ${theme.bar}`} 
                                        style={{ width: `${outcome.betCountPercentage}%` }}
                                     />
                                 </div>
                             </div>
                        </div>
                     );
                 })}
             </div>
         ) : (
             <div className="space-y-3 pt-1">
                 {/* List View Outcomes */}
                 {visibleOutcomes.map((outcome, idx) => {
                     const isBookmakerSide = market.isUserCreated && market.bookmakerSideId === outcome.id;
                     const isDisabled = isBookmakerSide; // Always disabled if bookmaker side
                     
                     // Use gray button for bookmaker side
                     const buttonClass = isBookmakerSide
                        ? 'bg-gray-100 text-gray-400' 
                        : 'bg-[#d1fae5] text-[#059669] hover:bg-[#a7f3d0]';
                     
                     return (
                        <div key={outcome.id} className="flex items-center justify-between group/row">
                             <div className="flex flex-col min-w-0 pr-4">
                                 <span className={`text-[13px] font-bold truncate ${isBookmakerSide && !isOwner ? 'text-gray-400' : 'text-gray-700'}`}>
                                    {outcome.label}
                                 </span>
                             </div>
                             <div className="flex items-center gap-6 shrink-0">
                                 <span className="text-[13px] font-bold text-gray-900 w-8 text-right">{outcome.betCountPercentage}%</span>
                                 <button
                                     onClick={(e) => { 
                                         e.stopPropagation();
                                         if (isDisabled) return;
                                         onBet(outcome); 
                                     }}
                                     disabled={isDisabled}
                                     className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center justify-center min-w-[60px] ${buttonClass}`}
                                 >
                                     {isBookmakerSide ? <Lock className="w-3 h-3" /> : '是'}
                                 </button>
                             </div>
                        </div>
                     )
                 })}
                 {/* Footer for extra outcomes */}
                 {market.outcomes.length > visibleOutcomes.length && (
                     <div className="text-center text-xs text-gray-400 font-medium pt-1">
                         查看全部 {market.outcomes.length} 个选项
                     </div>
                 )}
             </div>
         )}
      </div>

      {/* Footer: Volume & Date */}
      <div className="mt-5 flex items-center justify-between">
         <div className="flex items-center gap-4 text-[11px] text-gray-400 font-medium">
            <div className="flex items-center gap-1.5 text-blue-600/80">
                <div className="w-4 h-4 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <DollarSign className="w-2.5 h-2.5" />
                </div>
                <span>${formatNumber(market.volume)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatDate(market.endDate)}</span>
            </div>
         </div>
         
         {/* Tag for Bookmaker Mode */}
         {market.isUserCreated && (
             <span className="text-[10px] font-bold bg-[#fef3c7] text-[#d97706] px-2.5 py-1 rounded-[6px]">
                 庄家模式
             </span>
         )}
      </div>
    </div>
  );
};
