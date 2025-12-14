
import React from 'react';
import { Market, Outcome, User } from '../types';
import { Calendar, User as UserIcon, CheckCircle2, Star, Users, Lock, Plus } from 'lucide-react';

interface MarketCardProps {
  market: Market;
  onClick: () => void;
  onBet: (outcome: Outcome) => void;
  onToggleBookmark?: (id: string) => void;
  user: User | null;
}

const formatNumber = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
};

const formatDateNoYear = (dateStr: string) => {
  return dateStr.replace(/^\d{4}\//, '');
};

export const MarketCard: React.FC<MarketCardProps> = ({ market, onClick, onBet, onToggleBookmark, user }) => {
  // Determine Header Mode
  const isVsMode = market.teamHomeImage && market.teamAwayImage;
  const hasOutcomeImages = !isVsMode && market.outcomes.some(o => !!o.image);
  
  // Check if current user is the creator (Owner)
  const isOwner = user?.username === market.createdBy;
  
  // Calculate total participants
  const totalParticipants = market.outcomes.reduce((acc, o) => acc + (o.betCount || 0), 0);

  // Logic for displaying outcomes: Show max 4.
  // If > 4, show 4 and the "+X" footer.
  const MAX_VISIBLE = 4;
  const visibleOutcomes = market.outcomes.slice(0, MAX_VISIBLE);
  
  // Simple check for hidden outcomes since all markets are single-group
  const totalActiveOutcomes = market.outcomes.length;
  const activeVisibleCount = visibleOutcomes.length;
  const extraBettingOptionsCount = Math.max(0, totalActiveOutcomes - activeVisibleCount);

  // Grid Logic
  let gridClass = 'grid-cols-2';
  if (visibleOutcomes.length === 1) gridClass = 'grid-cols-1';
  else if (visibleOutcomes.length === 3) gridClass = 'grid-cols-3';

  // Compact mode for 2x2 grid (4 items)
  const isCompact = visibleOutcomes.length >= 4;

  // Sentiment Color Logic
  const allPercentages = visibleOutcomes.map(o => o.totalAmountPercentage);
  const maxPercent = Math.max(...allPercentages);
  const minPercent = Math.min(...allPercentages);
  const isAllEqual = allPercentages.length > 1 && allPercentages.every(p => p === allPercentages[0]);

  const getSentimentColor = (percent: number) => {
      if (isAllEqual) return { bar: 'bg-blue-500', text: 'text-blue-600', bg: 'bg-blue-50' };
      if (percent === maxPercent) return { bar: 'bg-red-500', text: 'text-red-600', bg: 'bg-red-50' }; 
      if (percent === minPercent) return { bar: 'bg-green-500', text: 'text-green-600', bg: 'bg-green-50' }; 
      return { bar: 'bg-blue-500', text: 'text-blue-600', bg: 'bg-blue-50' }; 
  };

  return (
    <div 
        onClick={onClick}
        className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all duration-300 flex flex-col h-full cursor-pointer relative"
    >
      {/* Header Section */}
      <div className={`relative h-32 overflow-hidden shrink-0 ${(isVsMode || hasOutcomeImages) ? 'bg-gradient-to-br from-indigo-50 via-blue-50 to-slate-50' : ''}`}>
        
        {/* Top Left: League Name with Logo */}
        <div className="absolute top-3 left-3 z-10 max-w-[65%]">
             <div className="bg-white/95 backdrop-blur-sm text-gray-900 text-[10px] font-black pl-1 pr-2.5 py-1 rounded-full shadow-sm border border-gray-100 flex items-center gap-1.5">
               <div className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center shrink-0 overflow-hidden ring-1 ring-gray-100">
                   <img 
                        src={`https://ui-avatars.com/api/?name=${market.league}&background=0f172a&color=fff&size=64&bold=true&length=2`} 
                        alt={market.league}
                        className="w-full h-full object-cover"
                   />
               </div>
               <span className="uppercase tracking-tight truncate pt-0.5">{market.league}</span>
            </div>
        </div>

        {/* Header Visuals */}
        {isVsMode ? (
          <>
            <div className="absolute inset-0 flex flex-col items-center justify-center mt-4">
                <div className="flex items-center justify-between w-full px-8 z-10">
                    <div className="flex flex-col items-center gap-2 w-1/3">
                    <div className="w-10 h-10 bg-white rounded-full p-2 shadow-lg flex items-center justify-center ring-1 ring-gray-100">
                        <img src={market.teamHomeImage} alt="Home" className="w-full h-full object-contain" />
                    </div>
                    </div>

                    <div className="flex flex-col items-center justify-center mt-1">
                        <span className="text-xl font-black text-blue-100 italic tracking-widest absolute">VS</span>
                        <span className="text-base font-bold text-blue-900 relative z-10">VS</span>
                    </div>

                    <div className="flex flex-col items-center gap-2 w-1/3">
                    <div className="w-10 h-10 bg-white rounded-full p-2 shadow-lg flex items-center justify-center ring-1 ring-gray-100">
                        <img src={market.teamAwayImage} alt="Away" className="w-full h-full object-contain" />
                    </div>
                    </div>
                </div>
            </div>
            {/* Background Decorations */}
            <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          </>
        ) : hasOutcomeImages ? (
          <>
            <div className="absolute inset-0 flex flex-col items-center justify-center mt-4">
                 <div className="flex items-center justify-center gap-3 px-3 z-10">
                    {market.outcomes.filter(o => o.image).slice(0, 5).map(o => (
                        <div key={o.id} className="flex flex-col items-center">
                            <div className="w-8 h-8 bg-white rounded-full p-1 shadow-md flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500 ring-1 ring-gray-100">
                                <img src={o.image} alt={o.label} className="w-full h-full object-contain rounded-full" />
                            </div>
                        </div>
                    ))}
                    {market.outcomes.filter(o => o.image).length > 5 && (
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-600 text-[10px] font-bold border border-blue-100 shadow-sm">
                            +{market.outcomes.filter(o => o.image).length - 5}
                        </div>
                    )}
                 </div>
            </div>
             {/* Background Decorations */}
            <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          </>
        ) : (
          <>
            <img
              src={market.image}
              alt={market.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
          </>
        )}
        
        {/* Date Badge - Absolute Bottom */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10">
            <div className="bg-white/80 backdrop-blur-sm text-gray-500 text-[9px] font-bold px-2.5 py-0.5 rounded-full shadow-sm border border-gray-100 flex items-center gap-1">
                <Calendar className="w-2.5 h-2.5 text-gray-400" />
                <span>{formatDateNoYear(market.endDate)}</span>
            </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-2.5 flex-1 flex flex-col">
        <div className="mb-2">
          <h3 className="text-xs font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
            {market.title}
          </h3>
        </div>

        {/* Outcomes Container */}
        <div className="h-[150px] flex flex-col justify-end mt-auto w-full">
            <div className={`grid ${gridClass} gap-2 ${extraBettingOptionsCount > 0 ? 'h-[115px]' : 'h-full'}`}>
            {visibleOutcomes.map((outcome) => {
                const isBookmakerSide = market.isUserCreated && market.bookmakerSideId === outcome.id;
                const sentiment = getSentimentColor(outcome.totalAmountPercentage);

                // Bookmaker Style Overrides
                const cardStyle = isBookmakerSide 
                    ? "bg-purple-50 border-purple-200 cursor-not-allowed opacity-90"
                    : "bg-gray-50 border-gray-100 hover:bg-blue-50 hover:border-blue-200 hover:shadow-md cursor-pointer";
                
                const lockedMessage = isOwner 
                    ? "我是庄家 (My Position)" 
                    : "该投注项已被庄家锁定，你只能投注该投注组合的其它选项";

                return (
                <button
                    key={outcome.id}
                    onClick={(e) => {
                        e.stopPropagation();
                        // If it is bookmaker side, block it (even for owner)
                        if (isBookmakerSide) {
                            alert(lockedMessage);
                            return;
                        }
                        onBet(outcome);
                    }}
                    title={isBookmakerSide ? lockedMessage : ""}
                    className={`relative flex flex-col justify-center rounded-xl border transition-all group/btn text-left overflow-hidden h-full ${isCompact ? 'p-1.5' : 'p-2'} ${cardStyle}`}
                >
                    {isBookmakerSide && (
                        <div className="absolute top-1 right-1 flex items-center gap-1">
                             <Lock className="w-2.5 h-2.5 text-purple-600" />
                        </div>
                    )}

                    {/* Top: Label */}
                    <div className="flex flex-col items-center justify-center w-full z-10 text-center mb-0.5">
                        <span className={`font-bold line-clamp-1 leading-tight text-[10px] ${isBookmakerSide ? (isOwner ? 'text-purple-900' : 'text-gray-500') : 'text-gray-900'}`}>
                            {outcome.label}
                        </span>
                        {/* Always purple subtitle for Bookmaker Side */}
                        {isBookmakerSide && <span className="text-[8px] font-bold -mt-0.5 text-purple-500">{isOwner ? '(我的持仓)' : '(庄家持仓)'}</span>}
                    </div>

                    {/* Middle: Progress Bar */}
                    <div className="w-full relative h-1 bg-gray-200 rounded-full overflow-hidden my-0.5 shrink-0">
                        <div 
                            className={`absolute left-0 top-0 h-full rounded-full ${isBookmakerSide ? 'bg-purple-500' : sentiment.bar}`} 
                            style={{ width: `${outcome.totalAmountPercentage}%` }}
                        ></div>
                    </div>

                    {/* Bottom: Stats */}
                    <div className="flex items-center justify-between w-full z-10 text-[10px] shrink-0 mt-0.5 px-0.5">
                        <span className={`font-bold tracking-tight text-[10px] ${isBookmakerSide ? (isOwner ? 'text-purple-900' : 'text-gray-500') : 'text-gray-900'}`}>
                            ${formatNumber(outcome.totalAmount)}
                        </span>
                        <span className={`font-bold px-1 py-0.5 rounded-[3px] text-[9px] ${isBookmakerSide ? 'bg-purple-100 text-purple-700' : `${sentiment.bg} ${sentiment.text}`}`}>
                            {outcome.totalAmountPercentage}%
                        </span>
                    </div>
                </button>
                );
            })}
            </div>

            {extraBettingOptionsCount > 0 && (
                <div className="h-[20px] flex items-center justify-center mt-1">
                    <span className="text-[9px] text-blue-600 font-bold bg-blue-50 border border-blue-100 px-3 py-0.5 rounded-full flex items-center gap-1">
                        更多投注项 +{extraBettingOptionsCount}
                    </span>
                </div>
            )}
        </div>

        {/* Footer */}
        <div className="mt-1.5 pt-1.5 border-t border-gray-50 flex items-center justify-between text-[10px] shrink-0">
           <div className="flex items-center gap-2">
               {/* Badges Removed Here */}

               <div className="flex items-center gap-1">
                 <span className="relative flex h-1.5 w-1.5">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                 </span>
                 <span className="font-medium text-green-600 scale-90 origin-left">进行中</span>
               </div>
           </div>
           
           <div className="flex items-center gap-2">
               <div className="flex items-center gap-0.5" title="参与人数">
                   <Users className="w-3 h-3 text-gray-400" />
                   <span className="text-gray-900 font-extrabold text-[10px]">{formatNumber(totalParticipants)}</span>
               </div>
               <div className="flex items-center gap-0.5">
                   <span className="text-gray-400 scale-75 origin-right">总池</span>
                   <span className="text-blue-700 font-black text-[10px]">${formatNumber(market.volume)}</span>
               </div>
           </div>
        </div>
      </div>
    </div>
  );
};
