
import React, { useState } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { MarketCard } from './components/MarketCard';
import { MarketCardAll } from './components/MarketCardAll';
import { Sidebar } from './components/Sidebar';
import { CreateMarketModal } from './components/CreateMarketModal';
import { MarketDetail } from './components/MarketDetail';
import { BetModal } from './components/BetModal';
import { LoginModal } from './components/LoginModal';
import { MOCK_MARKETS, CATEGORIES } from './constants';
import { Market, SportCategory, Outcome, User } from './types';
import { Search, Flame } from 'lucide-react';

const App: React.FC = () => {
  // Navigation State
  // 'ALL' corresponds to the new All Markets page
  // 'SPORTS_MAIN' and others correspond to existing logic
  const [activeCategory, setActiveCategory] = useState<string>(SportCategory.ALL);
  
  // Specific Sports State (Sidebar)
  const [activeSport, setActiveSport] = useState<SportCategory>(SportCategory.FOOTBALL); 
  const [activeLeague, setActiveLeague] = useState<string>('all');
  
  const [markets, setMarkets] = useState<Market[]>(MOCK_MARKETS);
  
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const [currentView, setCurrentView] = useState<'list' | 'detail'>('list');
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);

  // Betting State
  const [isBetModalOpen, setIsBetModalOpen] = useState(false);
  const [selectedOutcome, setSelectedOutcome] = useState<{market: Market, outcome: Outcome} | null>(null);

  const handleCreateMarket = (newMarketData: Partial<Market>) => {
    // Deduct liquidity from user balance
    if (user && newMarketData.volume) {
        setUser(prev => prev ? ({ ...prev, balance: prev.balance - newMarketData.volume! }) : null);
    }

    const newMarket = {
      ...newMarketData,
      id: `user-${Date.now()}`,
    } as Market;
    setMarkets([newMarket, ...markets]);
  };

  const handleLogin = (user: User) => {
    setUser(user);
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const navigateToDetail = (market: Market) => {
    // Ensure we are passing the latest version of the market from state
    const currentMarket = markets.find(m => m.id === market.id) || market;
    setSelectedMarket(currentMarket);
    setCurrentView('detail');
    window.scrollTo(0, 0);
  };

  const navigateToHome = () => {
    setCurrentView('list');
    setSelectedMarket(null);
  };

  const handleOpenBetModal = (market: Market, outcome: Outcome) => {
    if (!user) {
        setIsLoginModalOpen(true);
        return;
    }
    setSelectedOutcome({ market, outcome });
    setIsBetModalOpen(true);
  };

  // CORE LOGIC: Handle Placing a Bet
  const handlePlaceBet = (marketId: string, outcomeId: string, amount: number) => {
      if (!user) return;
      
      // 1. Deduct Balance
      const newBalance = user.balance - amount;
      setUser({ ...user, balance: newBalance });

      // 2. Update Market Data (Immutably)
      setMarkets(prevMarkets => prevMarkets.map(m => {
          if (m.id !== marketId) return m;

          const newVolume = m.volume + amount;
          
          const newOutcomes = m.outcomes.map(o => {
              // Always recalculate percentage based on new Total Volume
              if (o.id !== outcomeId) {
                  const percentage = newVolume > 0 ? Math.floor((o.totalAmount / newVolume) * 100) : 0;
                  return { ...o, totalAmountPercentage: percentage };
              }

              // This is the outcome being bet on
              const newTotalAmount = o.totalAmount + amount;
              const newMyPosition = (o.myPosition || 0) + amount;
              const percentage = newVolume > 0 ? Math.floor((newTotalAmount / newVolume) * 100) : 0;

              return {
                  ...o,
                  betCount: o.betCount + 1,
                  betCountPercentage: o.betCountPercentage, // Simplified for now
                  totalAmount: newTotalAmount,
                  totalAmountPercentage: percentage,
                  myPosition: newMyPosition
              };
          });

          const updatedMarket = {
              ...m,
              volume: newVolume,
              outcomes: newOutcomes,
              hasBet: true
          };

          // If we are currently viewing this market in details, update the selectedMarket state too
          if (selectedMarket && selectedMarket.id === marketId) {
              setSelectedMarket(updatedMarket);
          }

          return updatedMarket;
      }));
  };

  const handleToggleBookmark = (id: string) => {
    setMarkets(prev => prev.map(m => m.id === id ? { ...m, isBookmarked: !m.isBookmarked } : m));
  };

  const handleNavSelect = (id: string) => {
      setActiveCategory(id);
      setCurrentView('list');
      
      // If switching to sports, ensure a sport is active
      if (id === 'SPORTS_MAIN') {
          // Default to Football if undefined
          setActiveSport(SportCategory.FOOTBALL);
      }
  };

  const handleSidebarSelectCategory = (category: SportCategory) => {
      setActiveSport(category);
      setActiveLeague('all');
  };

  const handleRecharge = () => {
      alert("跳转至充值页面...");
  };

  // --- Filtering Logic ---
  
  // 1. Logic for "All Markets" View (Simple Global List)
  const allMarketsList = markets; // Can add search filter here if needed

  // 2. Logic for "Sports" View (Sidebar + Specific filters)
  const sportsFilteredMarkets = markets.filter(m => {
      if (activeCategory !== 'SPORTS_MAIN') return false;

      // 1. Filter by Sport Category
      if (activeSport !== SportCategory.ALL) {
          const categoryConfig = CATEGORIES.find(c => c.id === activeSport);
          
          if (categoryConfig && categoryConfig.leagues) {
               // Check if market belongs to one of the leagues in this category
               const matchesLeague = categoryConfig.leagues.some(l => l !== '其它' && m.league.includes(l));
               if (!matchesLeague) return false;
          } else {
               // If configured category has no leagues (and isn't ALL), don't show anything (or handle differently)
               return false;
          }
      } else {
          // Case: SportCategory.ALL ("全部体育")
          // We must ensure the market belongs to ONE of the valid sports categories (Football, Basketball, etc)
          // and EXCLUDE non-sports markets like Crypto or Entertainment.
          const belongsToAnySport = CATEGORIES.some(c => {
              // Skip ALL itself and categories without leagues (if any)
              if (c.id === SportCategory.ALL) return false;
              if (!c.leagues) return false;
              
              // Check if market matches any league in this category
              // Note: This logic assumes 'league' string in market includes the league name defined in constants
              return c.leagues.some(l => l !== '其它' && m.league.includes(l));
          });
          
          if (!belongsToAnySport) return false;
      }
      
      // 2. Filter by Specific League
      if (activeLeague !== 'all') {
          if (!m.league.includes(activeLeague)) return false;
      }
      
      return true;
  });

  const hotMarkets = markets.slice(0, 3);
  
  // Determine if we are in the new "All Markets" view
  const isAllMarketsView = activeCategory === SportCategory.ALL;
  // Determine if we are in the "Sports" view
  const isSportsView = activeCategory === 'SPORTS_MAIN';

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-900 pb-20 font-sans">
      <Header 
        user={user}
        onCreateMarket={() => setIsCreateModalOpen(true)}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
      />
      <Navigation 
         activeCategory={activeCategory}
         onSelect={handleNavSelect}
      />

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'list' ? (
          <>
            {/* VIEW 1: All Markets (New Design) */}
            {isAllMarketsView && (
                <div className="animate-in fade-in duration-300">
                    <div className="mb-6 flex items-baseline justify-between">
                        <h2 className="text-gray-900 font-bold text-xl">
                            人工智能 共有 <span className="text-blue-600">{allMarketsList.length}</span> 条结果
                        </h2>
                    </div>
                    
                    {/* Full Width Grid - 4 Columns as per screenshot */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {allMarketsList.map((market) => (
                            <MarketCardAll 
                                key={market.id} 
                                market={market} 
                                onClick={() => navigateToDetail(market)}
                                onBet={(outcome) => handleOpenBetModal(market, outcome)}
                                user={user}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* VIEW 2: Sports (Existing Design) */}
            {isSportsView && (
                <div className="animate-in fade-in duration-300">
                     {/* Hot Markets Carousel */}
                    <div className="mb-10">
                        <div className="flex items-center gap-2 mb-4">
                            <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
                            <h2 className="text-lg font-bold text-gray-900">热门赛事预测</h2>
                        </div>
                        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 no-scrollbar md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible md:pb-0 md:mx-0 md:px-0 md:gap-6">
                            {hotMarkets.map(market => (
                                <div key={`hot-${market.id}`} className="flex-none w-[85vw] sm:w-[350px] md:w-auto snap-center transform hover:-translate-y-1 transition-transform duration-300">
                                <MarketCard 
                                    market={market} 
                                    onClick={() => navigateToDetail(market)}
                                    onBet={(outcome) => handleOpenBetModal(market, outcome)}
                                    onToggleBookmark={handleToggleBookmark}
                                    user={user}
                                />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-8">
                        {/* Sidebar */}
                        <Sidebar 
                            activeCategory={activeSport}
                            activeLeague={activeLeague}
                            onSelectCategory={handleSidebarSelectCategory}
                            onSelectLeague={setActiveLeague}
                            markets={markets}
                        />

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="mb-6 flex items-baseline justify-between">
                                <h2 className="text-gray-900 font-bold text-xl">
                                    {activeSport} <span className="text-blue-600">{sportsFilteredMarkets.length}</span> 场比赛
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {sportsFilteredMarkets.length > 0 ? (
                                    sportsFilteredMarkets.map((market) => (
                                        <MarketCard 
                                            key={market.id} 
                                            market={market} 
                                            onClick={() => navigateToDetail(market)}
                                            onBet={(outcome) => handleOpenBetModal(market, outcome)}
                                            onToggleBookmark={handleToggleBookmark}
                                            user={user}
                                        />
                                    ))
                                ) : (
                                    <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-gray-100 border-dashed">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Search className="w-8 h-8 text-gray-300" />
                                        </div>
                                        <h3 className="text-gray-500 font-medium">暂无此类市场</h3>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* VIEW 3: Placeholders for other nav items */}
            {!isAllMarketsView && !isSportsView && (
                 <div className="py-20 text-center">
                    <h2 className="text-2xl font-bold text-gray-300">板块建设中...</h2>
                 </div>
            )}
          </>
        ) : (
          /* Detail View */
          selectedMarket && (
            <MarketDetail 
              market={selectedMarket} 
              onBack={navigateToHome} 
              onPlaceBet={(outcomeId, amount) => handlePlaceBet(selectedMarket.id, outcomeId, amount)}
              onBet={(outcome) => handleOpenBetModal(selectedMarket, outcome)} // Legacy prop for compatibility, though Detail uses onPlaceBet internally
              onOpenLogin={() => setIsLoginModalOpen(true)}
              user={user}
            />
          )
        )}
      </main>

      {/* Modals */}
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />

      <CreateMarketModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateMarket}
        onRecharge={handleRecharge}
        user={user}
      />

      {selectedOutcome && (
        <BetModal
            isOpen={isBetModalOpen}
            onClose={() => setIsBetModalOpen(false)}
            market={selectedOutcome.market}
            outcome={selectedOutcome.outcome}
            user={user}
            onPlaceBet={handlePlaceBet}
        />
      )}
    </div>
  );
};

export default App;
