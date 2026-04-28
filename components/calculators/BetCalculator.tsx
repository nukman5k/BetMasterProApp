
import React, { useState, useEffect } from 'react';
import { getBettingInsights } from '../../services/geminiService';
import { useSettings } from '../../App';
import { toDecimal, fromDecimal } from '../../utils/calculations';

interface Leg {
  id: number;
  odds: string;
}

const BetCalculator: React.FC = () => {
  const { oddsFormat } = useSettings();
  const [stake, setStake] = useState<string>('10');
  const [legs, setLegs] = useState<Leg[]>([{ id: 1, odds: fromDecimal(2.0, oddsFormat) }]);
  const [results, setResults] = useState<{ returns: number; profit: number }>({ returns: 0, profit: 0 });
  const [insights, setInsights] = useState<string | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  // When odds format changes, convert existing display values
  useEffect(() => {
    // Note: In a real app we might store decimal values in state and convert for display
    // but here we'll just reset or attempt a conversion to keep it simple.
  }, [oddsFormat]);

  useEffect(() => {
    calculate();
  }, [stake, legs, oddsFormat]);

  const calculate = () => {
    const s = parseFloat(stake) || 0;
    const combinedOdds = legs.reduce((acc, leg) => acc * toDecimal(leg.odds, oddsFormat), 1);
    const returns = s * combinedOdds;
    setResults({
      returns: parseFloat(returns.toFixed(2)),
      profit: parseFloat((returns - s).toFixed(2))
    });
  };

  const addLeg = () => {
    setLegs([...legs, { id: Date.now(), odds: fromDecimal(1.5, oddsFormat) }]);
  };

  const removeLeg = (id: number) => {
    if (legs.length > 1) {
      setLegs(legs.filter(l => l.id !== id));
    }
  };

  const handleUpdateLeg = (id: number, val: string) => {
    setLegs(legs.map(l => l.id === id ? { ...l, odds: val } : l));
  };

  const generateAIInsights = async () => {
    setLoadingInsights(true);
    const text = await getBettingInsights('Standard Bet / Accumulator', { stake, legs, results, oddsFormat });
    setInsights(text);
    setLoadingInsights(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Total Stake</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
            <input 
              type="number" 
              value={stake} 
              onChange={(e) => setStake(e.target.value)}
              className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">Selections ({oddsFormat})</h3>
            <button 
              onClick={addLeg}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <i className="fa-solid fa-plus text-xs"></i> Add Leg
            </button>
          </div>
          
          {legs.map((leg, index) => (
            <div key={leg.id} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-xs font-bold text-slate-400 border border-slate-200">
                {index + 1}
              </span>
              <div className="flex-1">
                <input 
                  type="text" 
                  value={leg.odds}
                  onChange={(e) => handleUpdateLeg(leg.id, e.target.value)}
                  className="w-full bg-white px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 transition-all text-sm"
                  placeholder={`Odds (${oddsFormat})`}
                />
              </div>
              <button 
                onClick={() => removeLeg(leg.id)}
                className="text-slate-400 hover:text-red-500 transition-colors px-2"
              >
                <i className="fa-solid fa-trash-can"></i>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-blue-600 text-white rounded-2xl p-6 shadow-xl shadow-blue-200">
          <h3 className="text-sm font-semibold uppercase tracking-wider opacity-80 mb-4">Summary</h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs opacity-70 mb-1">Total Returns</p>
              <p className="text-4xl font-bold">${results.returns}</p>
            </div>
            <div>
              <p className="text-xs opacity-70 mb-1">Total Profit</p>
              <p className="text-2xl font-bold text-green-300">+${results.profit}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              <i className="fa-solid fa-wand-magic-sparkles text-blue-500"></i>
              AI Insight
            </h4>
            <button 
              onClick={generateAIInsights}
              disabled={loadingInsights}
              className="text-xs bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-all disabled:opacity-50"
            >
              {loadingInsights ? 'Analyzing...' : 'Refresh'}
            </button>
          </div>
          <div className="text-sm text-slate-600 leading-relaxed max-h-64 overflow-y-auto custom-scrollbar">
            {insights ? insights : "Click 'Refresh' to get an AI breakdown of your bet structure, risk profile, and bankroll advice."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BetCalculator;
