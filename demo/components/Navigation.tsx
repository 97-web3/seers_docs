
import React from 'react';
import { SportCategory } from '../types';

interface NavigationProps {
  activeCategory: string;
  onSelect: (category: string) => void;
}

const navItems = [
  { label: '所有市场', id: SportCategory.ALL },
  { label: '体育', id: 'SPORTS_MAIN' }, // Maps to SportCategory logic in App
  { label: '加密货币', id: 'CRYPTO' },
  { label: '极速预测', id: 'SPEED' },
  { label: '探索更多', id: 'EXPLORE' },
];

export const Navigation: React.FC<NavigationProps> = ({ activeCategory, onSelect }) => {
  return (
    <div className="bg-white border-b border-gray-100 shadow-sm relative z-40">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8 h-12 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            // Highlight logic: 
            // 1. Exact match
            // 2. If active is a specific sport (e.g. BASKETBALL), and item is '体育', highlight it
            let isActive = activeCategory === item.id;
            
            if (item.id === 'SPORTS_MAIN' && (activeCategory !== SportCategory.ALL && activeCategory !== 'CRYPTO' && activeCategory !== 'SPEED' && activeCategory !== 'EXPLORE')) {
                isActive = true;
            }

            return (
                <button
                key={item.label}
                onClick={() => onSelect(item.id)}
                className={`relative h-full flex items-center px-1 text-sm font-bold whitespace-nowrap transition-colors ${
                    isActive
                    ? 'text-blue-600'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
                >
                {item.label}
                {/* Active Indicator Line */}
                {isActive && (
                    <div className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-600 rounded-t-full"></div>
                )}
                </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
