
import React, { useState, useEffect, useMemo } from 'react';
import { useSettings } from '../../App';
import { toDecimal, fromDecimal, getCombinations } from '../../utils/calculations';

type Outcome = 'WIN' | 'LOSS' | 'VOID';

interface BetEntry {
  id: string;
  odds: string;
  outcome: Outcome;
}

const SystemCalculator: React.FC = () => {
  const { oddsFormat } = useSettings();
  const [numSelections, setNumSelections] = useState<number>(4);
  const [systemK, setSystemK] = useState<number>(2);
  const [totalStake, setTotalStake] = useState<string>('100');
  const [bets, setBets] = useState<BetEntry[]>([]);

  // Initialize or adjust bets when numSelections changes
  useEffect(() => {
    setBets(prev => {
      const next = [...prev];
      if (next.length < numSelections) {
        for (let i = next.length; i < numSelections; i++) {
          next.push({ id: Math.random().toString(36).substr(2, 9), odds: fromDecimal(1.8, oddsFormat), outcome: 'WIN' });
        }
      } else {
        return next.slice(0, numSelections);
      }
      return next;
    });

    if (systemK > numSelections) {
      setSystemK(numSelections);
    }
  }, [numSelections]);

  const combinations = useMemo(() => {
    const indices = Array.from({ length: numSelections }, (_, i) => i);
    return getCombinations(indices, systemK);
  }, [numSelections, systemK]);

  const rowsCount = combinations.length;
  const stakePerRow = rowsCount > 0 ? parseFloat(totalStake) / rowsCount : 0;

  const calculateTotalReturn = (kSize: number) => {
    const indices = Array.from({ length: numSelections }, (_, i) => i);
    const combos = getCombinations(indices, kSize);
    const unitStake = parseFloat(totalStake) / combos.length;
    
    let totalRet = 0;
    combos.forEach(combo => {
      let comboOdds = 1;
      let isLost = false;
      for (const idx of combo) {
        const bet = bets[idx];
        if (!bet) continue;
        const decOdds = toDecimal(bet.odds, oddsFormat);
        if (bet.outcome === 'WIN') {
          comboOdds *= decOdds;
        } else if (bet.outcome === 'VOID') {
          comboOdds *= 1; // Void bet counts as 1.00 odds
        } else {
          isLost = true;
          break;
        }
      }
      if (!isLost) {
        totalRet += comboOdds * unitStake;
      }
    });
    return totalRet;
  };

  const currentReturn = calculateTotalReturn(systemK);
  const correctCount = bets.filter(b => b.outcome === 'WIN').length;

  // Data for the comparison chart
  const comparisonData = useMemo(() => {
    const sizes = [1, ...Array.from({ length: Math.max(0, numSelections - 2) }, (_, i) => i + 2), numSelections];
    const uniqueSizes = Array.from(new Set(sizes.filter(s => s <= numSelections))).sort((a, b) => a - b);
    
    return uniqueSizes.map(s => {
      let label = `${s}/${numSelections}`;
      if (s === 1) label = "Singles";
      if (s === numSelections) label = "Accumulator";
      return {
        label,
        value: calculateTotalReturn(s)
      };
    });
  }, [bets, numSelections, totalStake, oddsFormat]);

  const maxChartValue = Math.max(...comparisonData.map(d => d.value), parseFloat(totalStake) * 1.2, 10);

  return (
    <div className="space-y-10">
      {/* Input Section */}
      <section>
        <h2 className="text-xl font-bold text-slate-800 mb-6">Input</h2>
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <span className="font-bold text-slate-700 w-24">System</span>
            <div className="flex gap-2 flex-1 w-full">
              <select 
                value={systemK}
                onChange={(e) => setSystemK(parseInt(e.target.value))}
                className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-blue-600 font-bold focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {Array.from({ length: numSelections }, (_, i) => i + 1).map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
              <select 
                value={numSelections}
                onChange={(e) => setNumSelections(parseInt(e.target.value))}
                className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-blue-600 font-bold focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {[2, 3, 4, 5, 6, 7, 8].map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-center">
            <span className="font-bold text-slate-700 w-24">Total Stake</span>
            <input 
              type="number"
              value={totalStake}
              onChange={(e) => setTotalStake(e.target.value)}
              className="flex-1 w-full bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="space-y-2 pt-4">
            <span className="font-bold text-slate-700 block mb-2">Bets</span>
            {bets.map((bet, idx) => (
              <div key={bet.id} className="flex flex-wrap md:flex-nowrap gap-3 items-center">
                <span className="text-slate-500 text-sm w-16">Bet {idx + 1}</span>
                <input 
                  type="text"
                  value={bet.odds}
                  onChange={(e) => {
                    const next = [...bets];
                    next[idx].odds = e.target.value;
                    setBets(next);
                  }}
                  className="flex-1 min-w-[100px] bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Odds"
                />
                <select 
                  value={bet.outcome}
                  onChange={(e) => {
                    const next = [...bets];
                    next[idx].outcome = e.target.value as Outcome;
                    setBets(next);
                  }}
                  className="w-full md:w-32 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-blue-600 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="WIN">Won</option>
                  <option value="LOSS">Lost</option>
                  <option value="VOID">Void</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Result Section */}
      <section>
        <h2 className="text-xl font-bold text-slate-800 mb-6">Result</h2>
        <div className="flex flex-wrap justify-between gap-6 py-4 border-b border-slate-100">
          <div className="text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Bets</p>
            <p className="text-2xl font-bold text-slate-800">{numSelections}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Rows</p>
            <p className="text-2xl font-bold text-slate-800">{rowsCount}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Correct</p>
            <p className="text-2xl font-bold text-slate-800">{correctCount}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Stake/Row</p>
            <p className="text-2xl font-bold text-slate-800">{stakePerRow.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Return</p>
            <p className="text-3xl font-bold text-green-600">{currentReturn.toFixed(2)}</p>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section>
        <h2 className="text-xl font-bold text-slate-800 mb-2">System comparison</h2>
        <p className="text-sm text-slate-500 mb-8">
          This chart shows the potential return had you placed the same bets in a different system, as singles or in a parlay/accumulator.
        </p>
        
        <div className="relative h-80 w-full mt-10">
          <div className="absolute inset-0 flex items-end justify-around px-4">
            {comparisonData.map((data, i) => {
              const heightPercentage = (data.value / maxChartValue) * 100;
              return (
                <div key={i} className="flex flex-col items-center flex-1 max-w-[100px] group">
                  <div className="relative w-full flex flex-col justify-end h-64">
                    <div 
                      className={`w-full rounded-t-sm transition-all duration-500 bg-blue-500 group-hover:bg-blue-600`}
                      style={{ height: `${heightPercentage}%` }}
                    />
                    <div className="absolute -top-6 w-full text-center text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      {data.value.toFixed(2)}
                    </div>
                  </div>
                  <div className="mt-3 text-xs font-medium text-slate-600 text-center">
                    {data.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Grid lines and Stake line */}
          <div className="absolute inset-0 pointer-events-none border-b border-slate-300">
            {/* Horizontal Line for Total Stake */}
            <div 
              className="absolute w-full border-t border-slate-900 z-10 opacity-60"
              style={{ bottom: `${(parseFloat(totalStake) / maxChartValue) * 80}%` }}
            >
              <span className="absolute right-0 -top-5 text-[10px] font-bold text-slate-700 bg-white px-1">Total Stake</span>
            </div>
            
            {/* Guide Lines */}
            {[0.25, 0.5, 0.75, 1.0].map((level) => (
              <div 
                key={level}
                className="absolute w-full border-t border-slate-200 border-dotted"
                style={{ bottom: `${level * 80}%` }}
              >
                <span className="absolute -left-10 -top-2 text-[10px] text-slate-400">
                  {Math.round(level * maxChartValue)}
                </span>
              </div>
            ))}
          </div>
          
          <div className="absolute -left-12 top-0 h-80 flex items-center">
            <span className="rotate-[-90deg] text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Return</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SystemCalculator;
