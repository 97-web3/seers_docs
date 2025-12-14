
import React from 'react';
import { ChevronDown, ChevronRight, Trophy } from 'lucide-react';
import { SportCategory, Market } from '../types';
import { CATEGORIES } from '../constants';

interface SidebarProps {
  activeCategory: SportCategory;
  activeLeague: string;
  onSelectCategory: (cat: SportCategory) => void;
  onSelectLeague: (league: string) => void;
  markets: Market[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeCategory,
  activeLeague,
  onSelectCategory,
  onSelectLeague,
  markets,
}) => {
  return (
    <div className="w-64 shrink-0 hidden lg:block">
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 sticky top-24">
        <h3 className="text-gray-400 text-xs font-medium mb-4 pl-2">体育分类</h3>
        
        <div className="space-y-1">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            const hasLeagues = cat.leagues && cat.leagues.length > 0;
            
            // Calculate real count based on category definition
            // Dynamically check against all leagues defined for this category
            let realCount = 0;

            if (cat.id === SportCategory.ALL) {
                 // For "All Sports", strictly count only markets that belong to any of the OTHER defined sport categories (Football, Basketball etc)
                 // This ensures Crypto or Entertainment markets are NOT included in the "All Sports" count.
                 realCount = markets.filter(m => {
                    return CATEGORIES.some(otherCat => {
                        // Skip the ALL category itself
                        if (otherCat.id === SportCategory.ALL) return false;
                        
                        // Check if market matches any league in this specific sport category
                        if (otherCat.leagues && otherCat.leagues.length > 0) {
                             return otherCat.leagues.some(l => l !== '其它' && m.league.includes(l));
                        }
                        return false;
                    });
                 }).length;
            } else {
                 // For specific sports, filter by their defined leagues
                 realCount = markets.filter(m => {
                    if (cat.leagues && cat.leagues.length > 0) {
                         return cat.leagues.some(l => l !== '其它' && m.league.includes(l));
                    }
                    return false;
                }).length;
            }

            return (
              <div key={cat.id}>
                <button
                  onClick={() => onSelectCategory(cat.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all group ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg leading-none">{cat.icon}</span>
                    <span>{cat.id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className={`text-xs ${isActive ? 'text-blue-600/70' : 'text-gray-300'}`}>{realCount}</span>
                     {hasLeagues && (
                         isActive ? <ChevronDown className="w-3 h-3 text-blue-500" /> : <ChevronRight className="w-3 h-3 text-gray-300" />
                     )}
                  </div>
                </button>

                {/* Sub-menu for Leagues */}
                {isActive && hasLeagues && (
                  <div className="mt-1 ml-4 pl-4 border-l border-gray-100 space-y-0.5 animate-in slide-in-from-left-2 duration-200">
                    {cat.leagues?.map(league => {
                        // Count markets for this specific league
                        const leagueCount = markets.filter(m => m.league.includes(league)).length;
                        const isSelected = activeLeague === league;
                        return (
                            <button
                                key={league}
                                onClick={() => onSelectLeague(isSelected ? 'all' : league)} // Toggle selection
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                                    isSelected ? 'text-blue-600 bg-blue-50/50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                            >
                                <span className="truncate">{league}</span>
                                <span className="text-gray-300">{leagueCount}</span>
                            </button>
                        )
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
