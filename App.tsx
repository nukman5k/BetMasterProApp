
import React, { useState, createContext, useContext } from 'react';
import { CalculatorType, OddsFormat } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import BetCalculator from './components/calculators/BetCalculator';
import ArbCalculator from './components/calculators/ArbCalculator';
import SystemCalculator from './components/calculators/SystemCalculator';
import OddsConverter from './components/calculators/OddsConverter';
import MatchedBettingCalculator from './components/calculators/MatchedBettingCalculator';
import Dashboard from './components/Dashboard';
import SettingsModal from './components/SettingsModal';

interface SettingsContextType {
  oddsFormat: OddsFormat;
  setOddsFormat: (format: OddsFormat) => void;
}

export const SettingsContext = createContext<SettingsContextType>({
  oddsFormat: OddsFormat.DECIMAL,
  setOddsFormat: () => {},
});

export const useSettings = () => useContext(SettingsContext);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CalculatorType>(CalculatorType.BET_CALC);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [oddsFormat, setOddsFormat] = useState<OddsFormat>(OddsFormat.DECIMAL);

  const renderActiveCalculator = () => {
    switch (activeTab) {
      case CalculatorType.BET_CALC: return <BetCalculator />;
      case CalculatorType.ARB_CALC: return <ArbCalculator />;
      case CalculatorType.SYSTEM_CALC: return <SystemCalculator />;
      case CalculatorType.ODDS_CONVERTER: return <OddsConverter />;
      case CalculatorType.MATCHED_BETTING: return <MatchedBettingCalculator />;
      default: return <Dashboard onSelect={setActiveTab} />;
    }
  };

  return (
    <SettingsContext.Provider value={{ oddsFormat, setOddsFormat }}>
      <div className="flex min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen} 
        />
        
        <div className="flex-1 flex flex-col min-w-0">
          <Header 
            onMenuClick={() => setIsSidebarOpen(true)} 
            onSettingsClick={() => setIsSettingsOpen(true)}
          />
          
          <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto max-w-7xl mx-auto w-full">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {activeTab.replace('_', ' ')}
              </h1>
              <p className="mt-2 text-lg text-slate-600">
                Professional tools for data-driven betting decisions using <strong>{oddsFormat.toLowerCase()}</strong> odds.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              {renderActiveCalculator()}
            </div>
          </main>

          <footer className="py-6 px-8 border-t border-slate-200 text-center text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} BetMaster Pro. Responsible gambling is key.
          </footer>
        </div>

        <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      </div>
    </SettingsContext.Provider>
  );
};

export default App;
