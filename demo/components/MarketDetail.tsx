
import React, { useState, useEffect, useMemo } from 'react';
import { Market, Outcome, User } from '../types';
import { 
  ArrowLeft, Share2, Clock, Activity, Info, TrendingUp, 
  CheckCircle2, AlertCircle, Plus, Minus, Lock, ChevronRight, 
  ShieldCheck, AlertTriangle, Users, DollarSign, BarChart3, RefreshCcw, Lightbulb,
  Gavel, ScrollText, FileText, LogIn
} from 'lucide-react';

interface MarketDetailProps {
  market: Market;
  onBack: () => void;
  onBet: (outcome: Outcome) => void;
  onPlaceBet: (outcomeId: string, amount: number) => void; 
  onOpenLogin?: () => void;
  user: User | null;
}

const formatNumber = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
};

const MOCK_AVATARS = [
    "https://ui-avatars.com/api/?name=User1&background=random&color=fff",
    "https://ui-avatars.com/api/?name=User2&background=random&color=fff",
    "https://ui-avatars.com/api/?name=User3&background=random&color=fff",
    "https://ui-avatars.com/api/?name=User4&background=random&color=fff"
];

// Consistent colors for UI elements and Chart lines
const CHART_COLORS = [
    '#3b82f6', // Blue (Tailwind blue-500)
    '#6366f1', // Indigo (Tailwind indigo-500)
    '#8b5cf6', // Violet (Tailwind violet-500)
    '#d946ef', // Fuchsia (Tailwind fuchsia-500)
    '#ec4899', // Pink
    '#14b8a6', // Teal
];

export const MarketDetail: React.FC<MarketDetailProps> = ({ market, onBack, onBet, onPlaceBet, onOpenLogin, user }) => {
  const [selectedOutcomeId, setSelectedOutcomeId] = useState<string>('');
  const [amount, setAmount] = useState<string>('50.00');
  const [betView, setBetView] = useState<'betting' | 'success' | 'insufficient'>('betting');
  
  // Tab State
  const [activeTab, setActiveTab] = useState<'trend' | 'rules' | 'resolution'>('trend');
  const [chartPeriod, setChartPeriod] = useState<'1H' | '1D' | '1W' | '1M' | 'ALL'>('ALL');

  const BALANCE = user ? user.balance : 0;
  const isOwner = user?.username === market.createdBy;

  // Flatten outcomes logic
  const displayOutcomes = useMemo(() => {
      return market.outcomes.map(o => ({
          ...o,
          isBookmakerSide: o.isBookmakerSide === true || (market.isUserCreated && market.bookmakerSideId === o.id)
      }));
  }, [market]);

  // Filter out bookmaker sides for the betting panel
  const validBettingOutcomes = useMemo(() => {
      return displayOutcomes.filter(o => !o.isBookmakerSide);
  }, [displayOutcomes]);

  // Calculate percentages for color logic
  const { maxPercent, minPercent, isAllEqual } = useMemo(() => {
      const percentages = displayOutcomes.map(o => o.totalAmountPercentage);
      const maxPercent = Math.max(...percentages);
      const minPercent = Math.min(...percentages);
      const isAllEqual = percentages.length > 1 && percentages.every(p => p === percentages[0]);
      return { maxPercent, minPercent, isAllEqual };
  }, [displayOutcomes]);

  const selectedOutcome = displayOutcomes.find(o => o.id === selectedOutcomeId);

  // Initialize selection
  useEffect(() => {
      if (!selectedOutcomeId && validBettingOutcomes.length > 0) {
          // Select first valid outcome by default
          setSelectedOutcomeId(validBettingOutcomes[0].id);
      }
  }, [market.id, validBettingOutcomes]);

  // Reset betting form on selection change (optional, keeping amount might be better UX)
  useEffect(() => {
    setBetView('betting');
  }, [selectedOutcomeId]);

  const numAmount = parseFloat(amount) || 0;
  const potentialReturn = selectedOutcome ? numAmount * selectedOutcome.odds : 0;
  const profit = potentialReturn - numAmount;
  const fee = numAmount * 0.002; // 0.2% fee

  const handleQuickAmount = (val: number | 'ALL') => {
      if (val === 'ALL') {
          setAmount(BALANCE.toFixed(2));
      } else {
          setAmount(val.toFixed(2));
      }
  };

  const handleConfirmBet = () => {
    if (!user) {
        if (onOpenLogin) onOpenLogin();
        return;
    }
    if (numAmount <= 0) return;
    if (numAmount > BALANCE) {
        setBetView('insufficient');
    } else {
        if (selectedOutcome) {
            onPlaceBet(selectedOutcome.id, numAmount);
        }
        setBetView('success');
    }
  };

  // Generate deterministic pseudo-random path for chart lines
  const getOutcomeChartPath = (index: number, totalPoints = 12) => {
      // Base path points (0-100 Y scale, 0-600 X scale)
      const stepX = 600 / (totalPoints - 1);
      
      // Seed-based randomish variation
      const getVal = (i: number) => {
          const base = 40 + (index * 10) % 40; // Spread lines vertically
          const noise = Math.sin(i + index) * 15;
          const trend = i * 2; // Slight upward trend
          return Math.max(10, Math.min(90, base + noise + trend)); // Clamp between 10 and 90
      };

      let d = `M0,${getVal(0)}`;
      for (let i = 1; i < totalPoints; i++) {
          const x = i * stepX;
          const y = getVal(i);
          // Use cubic bezier for smoothness
          const prevX = (i - 1) * stepX;
          const prevY = getVal(i - 1);
          const cp1x = prevX + stepX / 2;
          const cp1y = prevY;
          const cp2x = x - stepX / 2;
          const cp2y = y;
          d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${x},${y}`;
      }
      return d;
  };

  // --- MY POSITIONS LOGIC ---
  const myPositions = market.outcomes.filter(o => (o.myPosition || 0) > 0);
  
  // 1. Calculate Total Invested
  const totalInvested = myPositions.reduce((acc, curr) => acc + (curr.myPosition || 0), 0);

  // 2. Calculate Max Potential Profit (Best Case Scenario)
  // Logic: In a mutually exclusive market, only one outcome wins.
  // We find the single outcome that gives the highest absolute return, then subtract total investment.
  const maxPotentialReturn = myPositions.reduce((max, curr) => {
      const potentialPayout = (curr.myPosition || 0) * curr.odds;
      return potentialPayout > max ? potentialPayout : max;
  }, 0);
  
  const maxProfit = maxPotentialReturn - totalInvested;

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      
      {/* 1. Back Button */}
      <div className="max-w-[1400px] mx-auto mb-6">
        <button 
            onClick={onBack} 
            className="group flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-bold text-sm px-2 py-1 -ml-2 rounded-lg hover:bg-white/50"
        >
            <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:border-gray-300 shadow-sm">
                <ArrowLeft className="w-4 h-4" />
            </div>
            返回体育首页
        </button>
      </div>

      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6 lg:p-8 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* LEFT COLUMN: Info & Chart (Span 8) */}
            <div className="lg:col-span-8 space-y-8">
                
                {/* 1. Header Info */}
                <div className="flex gap-5 items-start">
                    <div className="w-20 h-20 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                        <img src={market.image} alt={market.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl font-black text-gray-900 leading-tight mb-2 line-clamp-2">
                            {market.title}
                        </h1>
                        <p className="text-sm text-gray-500 leading-relaxed mb-3 line-clamp-2">
                            {market.description || '预测该事件的最终结果。市场价格反映了大众对结果发生概率的预期。'} 市场将于 {market.endDate} 结算。
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 font-medium">
                            <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold">体育</span>
                            <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded font-bold">预测市场</span>
                            <div className="w-px h-3 bg-gray-200"></div>
                            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {formatNumber(1420)} 人参与</span>
                            <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> 总池 ${formatNumber(market.volume)}</span>
                        </div>
                    </div>
                </div>

                {/* 2. Detailed Betting Info List (Moved above chart) */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Users className="w-5 h-5 text-gray-900" />
                        <h3 className="font-bold text-gray-900 text-lg">预测信息</h3>
                    </div>
                    <div className="space-y-4">
                        {displayOutcomes.map((outcome, idx) => {
                            const isSelected = selectedOutcomeId === outcome.id;
                            const isBookmaker = outcome.isBookmakerSide;
                            
                            // Visual Styles based on state (Red/Green/Blue logic)
                            // Default to Blue (Middle)
                            let progressColor = 'bg-blue-100';
                            let badgeColor = 'bg-blue-600';
                            let accentColor = 'text-blue-600';

                            if (isAllEqual) {
                                // Keep default blue
                            } else if (outcome.totalAmountPercentage === maxPercent) {
                                // Highest -> Red
                                progressColor = 'bg-red-100';
                                badgeColor = 'bg-red-600';
                                accentColor = 'text-red-600';
                            } else if (outcome.totalAmountPercentage === minPercent) {
                                // Lowest -> Green
                                progressColor = 'bg-green-100';
                                badgeColor = 'bg-green-600';
                                accentColor = 'text-green-600';
                            }

                            const avatarColor = CHART_COLORS[idx % CHART_COLORS.length]; // Match chart line color

                            return (
                                <div key={outcome.id} className="relative group">
                                    <div 
                                        onClick={() => !isBookmaker && setSelectedOutcomeId(outcome.id)}
                                        className={`relative overflow-hidden rounded-2xl border transition-all cursor-pointer h-16 sm:h-20 flex items-center
                                            ${isSelected 
                                                ? 'border-blue-500 ring-1 ring-blue-500 shadow-md' 
                                                : 'border-transparent bg-gray-50/50 hover:border-gray-200 hover:shadow-sm'
                                            }
                                            ${isBookmaker ? 'opacity-90' : ''}
                                        `}
                                    >
                                        {/* Background Progress Bar */}
                                        <div className={`absolute inset-y-0 left-0 transition-all duration-700 ${progressColor}`} style={{ width: `${outcome.totalAmountPercentage}%`, opacity: 0.8 }}></div>

                                        <div className="relative w-full px-3 sm:px-4 flex items-center justify-between z-10">
                                            {/* Left: Identity */}
                                            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                                                <div 
                                                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0 border-2 border-white`}
                                                    style={{ backgroundColor: avatarColor }}
                                                >
                                                    {outcome.label.substring(0, 1)}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="font-bold text-gray-900 text-sm sm:text-lg truncate pr-2">{outcome.label}</span>
                                                    {isBookmaker && <span className="text-[10px] text-purple-700 font-bold uppercase tracking-wider">Bookmaker</span>}
                                                </div>
                                            </div>

                                            {/* Right: Stats & Social */}
                                            <div className="flex items-center gap-3 sm:gap-6 shrink-0">
                                                
                                                {/* Amount & Trend */}
                                                <div className="text-right hidden sm:block">
                                                    <div className={`flex items-center justify-end gap-1 text-xs font-bold ${accentColor}`}>
                                                        <TrendingUp className="w-3 h-3" /> 看好
                                                    </div>
                                                    <div className="text-xs text-gray-500 font-bold">${formatNumber(outcome.totalAmount)}</div>
                                                </div>

                                                {/* Percentage Badge */}
                                                <div className={`${badgeColor} text-white text-xs sm:text-sm font-black px-2.5 py-1.5 rounded-lg shadow-sm min-w-[54px] text-center`}>
                                                    {outcome.totalAmountPercentage}%
                                                </div>

                                                {/* Social Proof Avatars */}
                                                <div className="flex items-center bg-white/60 rounded-full pl-1 pr-3 py-1 border border-white/50 backdrop-blur-sm">
                                                    <div className="flex -space-x-2 mr-2">
                                                        {MOCK_AVATARS.slice(0, 3).map((av, i) => (
                                                            <img key={i} src={av} className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-white bg-gray-100" alt="" />
                                                        ))}
                                                    </div>
                                                    <span className="text-[10px] sm:text-xs text-gray-600 font-bold">
                                                        +{Math.floor(Math.random() * 200 + 100)}人
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 3. Main Content Tabs (Trend / Rules / Resolution) */}
                <div>
                    {/* Tab Navigation */}
                    <div className="flex items-center gap-6 border-b border-gray-100 mb-6">
                         <button 
                            onClick={() => setActiveTab('trend')}
                            className={`pb-3 text-sm font-bold flex items-center gap-2 transition-all border-b-2 ${activeTab === 'trend' ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent hover:text-gray-800'}`}
                         >
                             <Activity className="w-4 h-4" /> 走势
                         </button>
                         <button 
                            onClick={() => setActiveTab('rules')}
                            className={`pb-3 text-sm font-bold flex items-center gap-2 transition-all border-b-2 ${activeTab === 'rules' ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent hover:text-gray-800'}`}
                         >
                             <ScrollText className="w-4 h-4" /> 市场规则
                         </button>
                         <button 
                            onClick={() => setActiveTab('resolution')}
                            className={`pb-3 text-sm font-bold flex items-center gap-2 transition-all border-b-2 ${activeTab === 'resolution' ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent hover:text-gray-800'}`}
                         >
                             <Gavel className="w-4 h-4" /> 裁决
                         </button>
                    </div>

                    {/* Tab Content: TREND */}
                    {activeTab === 'trend' && (
                        <div className="animate-in fade-in duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
                                    全网交易走势
                                </h3>
                                <div className="flex bg-gray-100 rounded-lg p-0.5">
                                    {['1H', '1D', '1W', '1M', 'ALL'].map(p => (
                                        <button 
                                            key={p} 
                                            onClick={() => setChartPeriod(p as any)}
                                            className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${chartPeriod === p ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-2xl border border-gray-100 p-6 h-[320px] relative shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                                {/* Y-Axis Labels */}
                                <div className="absolute left-4 top-6 bottom-8 flex flex-col justify-between text-[10px] text-gray-300 font-medium">
                                    <span>100%</span>
                                    <span>75%</span>
                                    <span>50%</span>
                                    <span>25%</span>
                                    <span>0%</span>
                                </div>
                                
                                {/* Grid Lines */}
                                <div className="absolute inset-0 pl-12 pr-6 py-6 flex flex-col justify-between pointer-events-none">
                                    {[1,2,3,4,5].map(i => <div key={i} className="w-full h-px bg-gray-50 border-t border-dashed border-gray-100"></div>)}
                                </div>

                                {/* Chart Area - Render Multiple Paths for All Outcomes */}
                                <div className="absolute inset-0 pl-12 pr-6 py-6">
                                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 600 100">
                                        {displayOutcomes.map((outcome, idx) => {
                                            const color = CHART_COLORS[idx % CHART_COLORS.length];
                                            return (
                                                <g key={outcome.id}>
                                                    <path 
                                                        d={getOutcomeChartPath(idx)} 
                                                        fill="none" 
                                                        stroke={color} 
                                                        strokeWidth="2.5" 
                                                        strokeLinecap="round" 
                                                        strokeOpacity="0.8"
                                                        className="drop-shadow-sm vector-effect-non-scaling-stroke hover:stroke-width-4 transition-all" 
                                                    />
                                                </g>
                                            )
                                        })}
                                    </svg>
                                </div>
                                
                                {/* X-Axis Labels */}
                                <div className="absolute bottom-2 left-12 right-6 flex justify-between text-[10px] text-gray-400 font-medium px-2">
                                    <span>30天前</span>
                                    <span>20天前</span>
                                    <span>10天前</span>
                                    <span>今天</span>
                                </div>
                            </div>

                            {/* Legend for All Outcomes */}
                            <div className="flex flex-wrap gap-4 mt-4 ml-2">
                                {displayOutcomes.map((outcome, idx) => (
                                    <div key={outcome.id} className="flex items-center gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}></div>
                                        <span className="text-xs font-bold text-gray-600">{outcome.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tab Content: RULES */}
                    {activeTab === 'rules' && (
                        <div className="animate-in fade-in duration-300 space-y-6">
                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <ScrollText className="w-5 h-5 text-gray-500" />
                                    结算规则详情
                                </h4>
                                <ul className="space-y-4 text-sm text-gray-600">
                                    <li className="flex gap-3">
                                        <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 text-xs font-bold">1</div>
                                        <p>市场将根据官方赛果进行结算。如果比赛延期超过24小时，市场可能会被取消并退款。</p>
                                    </li>
                                    <li className="flex gap-3">
                                        <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 text-xs font-bold">2</div>
                                        <p>所有时间均为 UTC 时间。请留意具体的投注截止时间，一旦比赛开始，流动性池可能锁定。</p>
                                    </li>
                                    <li className="flex gap-3">
                                        <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 text-xs font-bold">3</div>
                                        <p>对于足球比赛，除非另有说明（如“晋级”），否则通常指90分钟常规时间（含补时）的结果，不包括加时赛和点球大战。</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Tab Content: RESOLUTION */}
                    {activeTab === 'resolution' && (
                        <div className="animate-in fade-in duration-300 space-y-6">
                             <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100">
                                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                                    去中心化裁决机制
                                </h4>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
                                        <span className="text-xs font-bold text-gray-500">数据源 (Oracle)</span>
                                        <span className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                            UMA Protocol
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
                                        <span className="text-xs font-bold text-gray-500">挑战期</span>
                                        <span className="text-sm font-bold text-gray-900">2 小时</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
                                        <span className="text-xs font-bold text-gray-500">争议解决方</span>
                                        <span className="text-sm font-bold text-gray-900">Kleros Court</span>
                                    </div>
                                    
                                    <p className="text-xs text-gray-500 leading-relaxed mt-2">
                                        本市场采用乐观预言机机制。任何人都可以提交结果，如果在挑战期内无人提出异议，该结果将被视为最终结果。若有争议，将提交至去中心化法庭进行仲裁。
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 4. Disclaimer (Price Efficiency Removed) */}
                <div className="bg-[#fff7ed] rounded-2xl p-4 border border-orange-100 flex items-start gap-3 mt-4">
                     <Lightbulb className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" />
                     <div>
                         <h4 className="text-sm font-bold text-orange-800 mb-1">交易提示</h4>
                         <p className="text-xs text-orange-700/80 leading-relaxed">
                            市场处于平衡状态，价格反映了较高的不确定性。请理性参与，不要投入超过您可承受损失的金额。
                        </p>
                     </div>
                </div>

            </div>

            {/* RIGHT COLUMN: Interactive Panel (Span 4) */}
            <div className="lg:col-span-4 space-y-6">
                
                {/* 1. Betting & Selection Panel (REMOVED sticky top-24) */}
                <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden flex flex-col">
                    
                    {/* Header: Option Selection */}
                    <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-blue-600" /> 选择下注选项
                        </h3>
                        <span className="text-xs text-gray-400 font-medium">{validBettingOutcomes.length} 个选项</span>
                    </div>

                    <div className="p-5 space-y-6">
                        {/* Outcome Grid List */}
                        <div className="grid grid-cols-2 gap-2 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
                            {validBettingOutcomes.map((outcome) => {
                                const isSelected = selectedOutcomeId === outcome.id;
                                
                                return (
                                    <button
                                        key={outcome.id}
                                        onClick={() => setSelectedOutcomeId(outcome.id)}
                                        className={`relative p-3 rounded-xl border text-left transition-all duration-200 group flex flex-col gap-1
                                            ${isSelected 
                                                ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500 shadow-sm' 
                                                : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                            }
                                        `}
                                    >
                                        <div className="flex justify-between items-start w-full">
                                            <span className={`text-xs font-bold line-clamp-2 leading-tight ${isSelected ? 'text-blue-900' : 'text-gray-700'}`}>
                                                {outcome.label}
                                            </span>
                                        </div>
                                        
                                        <div className="mt-auto pt-2 flex justify-between items-end">
                                            <span className={`text-lg font-black leading-none ${isSelected ? 'text-blue-600' : 'text-gray-900'}`}>
                                                {outcome.betCountPercentage}%
                                            </span>
                                            <span className="text-[10px] text-gray-400 font-medium">
                                                ${formatNumber(outcome.totalAmount)}
                                            </span>
                                        </div>
                                        
                                        {/* Progress Bar inside card */}
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 rounded-b-xl overflow-hidden">
                                            <div 
                                                className={`h-full ${isSelected ? 'bg-blue-500' : 'bg-gray-300 group-hover:bg-blue-400'}`} 
                                                style={{ width: `${outcome.betCountPercentage}%` }}
                                            ></div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-gray-100 w-full"></div>

                        {/* Betting Amount Section */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-gray-500">下注金额</label>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 pl-8 text-lg font-bold text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                    placeholder="0.00"
                                />
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                            </div>
                            
                            {/* Quick Buttons */}
                            <div className="flex gap-2">
                                {[2, 5, 10, 100].map(val => (
                                    <button 
                                        key={val}
                                        onClick={() => handleQuickAmount(val)}
                                        className="flex-1 bg-white border border-gray-200 hover:border-blue-300 hover:text-blue-600 text-gray-600 text-xs font-bold py-2 rounded-lg transition-all"
                                    >
                                        $ {val}
                                    </button>
                                ))}
                                <button 
                                    onClick={() => handleQuickAmount('ALL')}
                                    className="flex-1 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-600 text-xs font-bold py-2 rounded-lg transition-all"
                                >
                                    全部
                                </button>
                            </div>
                        </div>

                        {/* Summary & Stats */}
                        <div className="space-y-2 pt-1">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-400">当前投入金额</span>
                                <span className="font-bold text-gray-900">${numAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-400">潜在回报</span>
                                <span className="font-bold text-green-600">${potentialReturn.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-400">手续费 (0.2%)</span>
                                <span className="font-bold text-red-400">-${fee.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs mt-2 pt-2 border-t border-gray-50">
                                <span className="text-gray-400 font-medium">账户余额</span>
                                <span className="font-black text-gray-900">${BALANCE.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Confirm Button */}
                        {!user ? (
                             <button 
                                onClick={onOpenLogin}
                                className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3.5 rounded-xl shadow-lg transition-all text-sm flex items-center justify-center gap-2"
                             >
                                <LogIn className="w-4 h-4" /> 登录以进行投注
                             </button>
                        ) : betView === 'success' ? (
                            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center animate-in fade-in zoom-in-95">
                                <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                <div className="text-sm font-bold text-green-800 mb-1">下注成功!</div>
                                <button onClick={() => setBetView('betting')} className="text-xs font-bold text-green-600 hover:underline">继续下注</button>
                            </div>
                        ) : betView === 'insufficient' ? (
                            <button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-red-200 transition-all text-sm flex items-center justify-center gap-2">
                                <AlertCircle className="w-4 h-4" /> 余额不足
                            </button>
                        ) : (
                            <button 
                                onClick={handleConfirmBet}
                                disabled={!selectedOutcome || numAmount <= 0}
                                className={`w-full font-bold py-3.5 rounded-xl shadow-lg transition-all text-sm
                                    ${!selectedOutcome || numAmount <= 0 
                                        ? 'bg-[#2563eb] opacity-50 cursor-not-allowed shadow-none text-white' 
                                        : 'bg-[#2563eb] hover:bg-blue-700 text-white shadow-blue-200 active:scale-[0.98]'}
                                `}
                            >
                                确认下注
                            </button>
                        )}
                    </div>
                </div>

                {/* 2. My Positions (Below Betting) */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                            <Activity className="w-4 h-4 text-gray-900" /> 我的持仓
                        </h4>
                        <span className="text-[10px] text-gray-400">持仓将在市场结算时自动计算收益</span>
                    </div>

                    <div className="bg-[#f9fafb] rounded-xl p-4 border border-gray-100">
                        <div className="flex gap-4 mb-4">
                            <div className="flex-1 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                                <div className="text-[10px] text-gray-400 font-bold mb-1">总投入</div>
                                <div className="text-sm font-black text-gray-900">$ {totalInvested.toFixed(2)}</div>
                            </div>
                            <div className="flex-1 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                                <div className="text-[10px] text-gray-400 font-bold mb-1">最大潜在利润</div>
                                <div className={`text-sm font-black ${maxProfit >= 0 ? 'text-green-500' : 'text-gray-400'}`}>
                                    {maxProfit >= 0 ? '+' : ''}{maxProfit.toFixed(2)}
                                </div>
                            </div>
                        </div>

                        {/* List of positions */}
                        <div className="space-y-2">
                            {myPositions.length > 0 ? myPositions.map(pos => {
                                const posInvestment = pos.myPosition || 0;
                                const posPotentialReturn = posInvestment * pos.odds;
                                const posProfit = posPotentialReturn - posInvestment;
                                
                                return (
                                <div key={pos.id} className="bg-[#ecfdf5] border border-emerald-200 rounded-lg p-3 relative overflow-hidden">
                                    <div className="flex justify-between items-start relative z-10">
                                        <div>
                                            <div className="flex items-center gap-1.5 mb-1">
                                                <TrendingUp className="w-3 h-3 text-emerald-600" />
                                                <span className="text-xs font-bold text-emerald-900">看好</span>
                                                <span className="text-[10px] text-emerald-600">({pos.label})</span>
                                            </div>
                                        </div>
                                        <div className="bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">持有中</div>
                                    </div>
                                    <div className="mt-2 flex justify-between items-end relative z-10">
                                        <div>
                                            <div className="text-[9px] text-emerald-600/70">下注金额</div>
                                            <div className="text-sm font-bold text-emerald-900">$ {posInvestment.toFixed(2)}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[9px] text-emerald-600/70">预测正确可得利润</div>
                                            <div className="text-sm font-bold text-emerald-900">+{posProfit.toFixed(2)}</div>
                                        </div>
                                    </div>
                                </div>
                                );
                            }) : (
                                <div className="text-center py-4 text-xs text-gray-400">暂无持仓</div>
                            )}
                        </div>
                    </div>

                    <div className="bg-[#fffbeb] border border-[#fef3c7] rounded-xl p-4">
                        <div className="flex items-start gap-2 mb-1">
                            <AlertCircle className="w-3.5 h-3.5 text-orange-500 mt-0.5" />
                            <span className="text-xs font-bold text-orange-700">对冲提示</span>
                        </div>
                        <p className="text-[10px] text-orange-600/80 leading-relaxed">
                            您在双方都有持仓。无论结果如何，您都将获得部分回报，但最大收益受限。
                        </p>
                    </div>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
};
