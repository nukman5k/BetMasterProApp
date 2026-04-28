
import React from 'react';
import { CalculatorType } from '../types';

interface SidebarProps {
  activeTab: CalculatorType;
  setActiveTab: (tab: CalculatorType) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const menuItems = [
    { type: CalculatorType.BET_CALC, label: 'Standard Bet Calc', icon: 'fa-calculator' },
    { type: CalculatorType.ARB_CALC, label: 'Arbitrage Finder', icon: 'fa-scale-balanced' },
    { type: CalculatorType.SYSTEM_CALC, label: 'System / Combo', icon: 'fa-layer-group' },
    { type: CalculatorType.ODDS_CONVERTER, label: 'Odds Converter', icon: 'fa-right-left' },
    { type: CalculatorType.MATCHED_BETTING, label: 'Matched Betting', icon: 'fa-handshake' },
  ];

  const handleNav = (tab: CalculatorType) => {
    setActiveTab(tab);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <i className="fa-solid fa-bolt text-xl"></i>
            </div>
            <span className="text-xl font-bold tracking-tight">BetMaster Pro</span>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.type}
                onClick={() => handleNav(item.type)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                  ${activeTab === item.type 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'}
                `}
              >
                <i className={`fa-solid ${item.icon} w-5`}></i>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-4 bg-slate-800 m-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <i className="fa-solid fa-circle-info text-blue-400"></i>
              <span className="text-xs font-semibold uppercase text-slate-400">AI Enabled</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Gemini AI analyzes your inputs for value and risk in real-time.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
