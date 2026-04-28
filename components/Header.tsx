
import React from 'react';

interface HeaderProps {
  onMenuClick: () => void;
  onSettingsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onSettingsClick }) => {
  return (
    <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 md:px-8">
      <button 
        onClick={onMenuClick}
        className="p-2 -ml-2 text-slate-600 lg:hidden hover:bg-slate-100 rounded-lg transition-colors"
      >
        <i className="fa-solid fa-bars text-xl"></i>
      </button>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Live Market Data: ON
        </div>
        <button 
          onClick={onSettingsClick}
          className="text-slate-600 hover:text-slate-900 p-2 hover:bg-slate-100 rounded-lg transition-colors"
          title="App Settings"
        >
          <i className="fa-solid fa-gear"></i>
        </button>
      </div>
    </header>
  );
};

export default Header;
