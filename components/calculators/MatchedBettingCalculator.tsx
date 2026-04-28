
import React, { useState, useEffect } from 'react';

const MatchedBettingCalculator: React.FC = () => {
  const [backStake, setBackStake] = useState('10');
  const [backOdds, setBackOdds] = useState('2.0');
  const [layOdds, setLayOdds] = useState('2.05');
  const [layCommission, setLayCommission] = useState('2');
  const [mode, setMode] = useState<'NORMAL' | 'SNR'>('NORMAL'); // Normal or Free Bet (Stake Not Returned)

  const [results, setResults] = useState({ layStake: 0, liability: 0, profit: 0 });

  useEffect(() => {
    const bs = parseFloat(backStake) || 0;
    const bo = parseFloat(backOdds) || 1;
    const lo = parseFloat(layOdds) || 1;
    const lc = (parseFloat(layCommission) || 0) / 100;

    let ls = 0;
    if (mode === 'NORMAL') {
      ls = (bo * bs) / (lo - lc);
    } else {
      ls = ((bo - 1) * bs) / (lo - lc);
    }

    const liability = ls * (lo - 1);
    const profit = mode === 'NORMAL' ? (bs * bo) - bs - liability : (bs * (bo - 1)) - liability;

    setResults({
      layStake: parseFloat(ls.toFixed(2)),
      liability: parseFloat(liability.toFixed(2)),
      profit: parseFloat(profit.toFixed(2))
    });
  }, [backStake, backOdds, layOdds, layCommission, mode]);

  return (
    <div className="space-y-8">
      <div className="flex bg-slate-100 p-1 rounded-xl w-fit mx-auto">
        <button 
          onClick={() => setMode('NORMAL')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'NORMAL' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}
        >
          Qualifying Bet
        </button>
        <button 
          onClick={() => setMode('SNR')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'SNR' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}
        >
          Free Bet (SNR)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Back Stake</label>
              <input type="number" value={backStake} onChange={e => setBackStake(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Back Odds</label>
              <input type="number" step="0.01" value={backOdds} onChange={e => setBackOdds(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Lay Odds</label>
              <input type="number" step="0.01" value={layOdds} onChange={e => setLayOdds(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Lay Commission (%)</label>
              <input type="number" value={layCommission} onChange={e => setLayCommission(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 text-white rounded-3xl p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-blue-400 font-bold uppercase tracking-widest text-xs mb-6">Execution Strategy</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-end border-b border-slate-800 pb-4">
                <span className="text-slate-400">Optimal Lay Stake</span>
                <span className="text-3xl font-bold">${results.layStake}</span>
              </div>
              <div className="flex justify-between items-end border-b border-slate-800 pb-4">
                <span className="text-slate-400">Exchange Liability</span>
                <span className="text-xl font-bold text-red-400">${results.liability}</span>
              </div>
              <div className="flex justify-between items-end pt-4">
                <span className="text-slate-400">Total {mode === 'NORMAL' ? 'Loss' : 'Profit'}</span>
                <span className={`text-3xl font-bold ${results.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${results.profit}
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
            <p className="text-xs text-slate-400 italic">
              "Place a ${backStake} back bet at {backOdds}, then lay ${results.layStake} at {layOdds} with the exchange."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchedBettingCalculator;
