
import React from 'react';
import { CalculatorType } from '../types';

interface DashboardProps {
  onSelect: (type: CalculatorType) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelect }) => {
  const cards = [
    { 
      type: CalculatorType.BET_CALC, 
      title: 'Standard Bet', 
      desc: 'Calculate single and accumulator returns.', 
      icon: 'fa-calculator', 
      color: 'bg-blue-50 text-blue-600' 
    },
    { 
      type: CalculatorType.ARB_CALC, 
      title: 'Arbitrage', 
      desc: 'Lock in guaranteed profits from market gaps.', 
      icon: 'fa-scale-balanced', 
      color: 'bg-green-50 text-green-600' 
    },
    { 
      type: CalculatorType.SYSTEM_CALC, 
      title: 'System / Combo', 
      desc: 'Complex math for Yankee, Trixie, and lucky bets.', 
      icon: 'fa-layer-group', 
      color: 'bg-purple-50 text-purple-600' 
    },
    { 
      type: CalculatorType.MATCHED_BETTING, 
      title: 'Matched Betting', 
      desc: 'Extract value from free bets and promos.', 
      icon: 'fa-handshake', 
      color: 'bg-amber-50 text-amber-600' 
    },
    { 
      type: CalculatorType.ODDS_CONVERTER, 
      title: 'Odds Converter', 
      desc: 'Switch between format styles instantly.', 
      icon: 'fa-right-left', 
      color: 'bg-slate-100 text-slate-600' 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map(card => (
        <button 
          key={card.type}
          onClick={() => onSelect(card.type)}
          className="calculator-card p-6 bg-white border border-slate-200 rounded-3xl text-left hover:shadow-xl hover:shadow-slate-200 transition-all group"
        >
          <div className={`w-14 h-14 rounded-2xl ${card.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
            <i className={`fa-solid ${card.icon} text-2xl`}></i>
          </div>
          <h3 className="text-xl font-bold mb-2">{card.title}</h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            {card.desc}
          </p>
          <span className="text-sm font-semibold text-blue-600 flex items-center gap-1 group-hover:gap-3 transition-all">
            Open Calculator <i className="fa-solid fa-arrow-right"></i>
          </span>
        </button>
      ))}
    </div>
  );
};

export default Dashboard;
