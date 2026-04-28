
import React, { useState, useEffect } from 'react';
import { useSettings } from '../../App';
import { toDecimal, fromDecimal } from '../../utils/calculations';

const ArbCalculator: React.FC = () => {
  const { oddsFormat } = useSettings();
  const [totalStake, setTotalStake] = useState<string>('100');
  const [outcomes, setOutcomes] = useState([
    { odds: fromDecimal(2.1, oddsFormat), stake: 0, profit: 0 }, 
    { odds: fromDecimal(2.1, oddsFormat), stake: 0, profit: 0 }
  ]);
  const [arbPercentage, setArbPercentage] = useState<number>(0);
  const [isArb, setIsArb] = useState(false);

  useEffect(() => {
    calculate();
  }, [totalStake, outcomes.map(o => o.odds), oddsFormat]);

  const calculate = () => {
    const totalS = parseFloat(totalStake) || 0;
    const invSum = outcomes.reduce((acc, o) => acc + (1 / toDecimal(o.odds, oddsFormat)), 0);
    const arbPct = invSum * 100;
    setArbPercentage(parseFloat(arbPct.toFixed(2)));
    setIsArb(arbPct < 100);

    const updatedOutcomes = outcomes.map(o => {
      const odds = toDecimal(o.odds, oddsFormat);
      const s = (totalS / (odds * invSum));
      const p = (s * odds) - totalS;
      return { ...o, stake: parseFloat(s.toFixed(2)), profit: parseFloat(p.toFixed(2)) };
    });
    setOutcomes(updatedOutcomes);
  };

  const addOutcome = () => {
    if (outcomes.length < 5) setOutcomes([...outcomes, { odds: fromDecimal(3.0, oddsFormat), stake: 0, profit: 0 }]);
  };

  const removeOutcome = (idx: number) => {
    if (outcomes.length > 2) setOutcomes(outcomes.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-1 space-y-6 w-full">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Total Target Stake</label>
            <input 
              type="number" 
              value={totalStake} 
              onChange={(e) => setTotalStake(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Market Outcomes ({oddsFormat})</h3>
              <button onClick={addOutcome} className="text-sm text-blue-600 font-medium">+ Add Outcome</button>
            </div>
            {outcomes.map((o, idx) => (
              <div key={idx} className="flex gap-4 p-4 bg-white border border-slate-100 rounded-xl shadow-sm items-center">
                <div className="flex-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Odds</label>
                  <input 
                    type="text" 
                    value={o.odds}
                    onChange={(e) => {
                      const newOutcomes = [...outcomes];
                      newOutcomes[idx].odds = e.target.value;
                      setOutcomes(newOutcomes);
                    }}
                    className="w-full bg-slate-50 px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Suggested Stake</label>
                  <div className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-medium">
                    ${o.stake}
                  </div>
                </div>
                <button onClick={() => removeOutcome(idx)} className="mt-5 text-slate-300 hover:text-red-500 transition-colors">
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full md:w-80 space-y-6">
          <div className={`p-6 rounded-2xl border-2 transition-all ${isArb ? 'border-green-500 bg-green-50' : 'border-slate-200 bg-slate-50'}`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold uppercase text-slate-500">Arb Status</span>
              {isArb ? (
                <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">OPPORTUNITY</span>
              ) : (
                <span className="bg-slate-300 text-white text-[10px] font-bold px-2 py-0.5 rounded">NO ARB</span>
              )}
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500 mb-1">Implied Probability Sum</p>
              <p className={`text-4xl font-black ${isArb ? 'text-green-600' : 'text-slate-700'}`}>
                {arbPercentage}%
              </p>
              {isArb && (
                <p className="text-sm font-medium text-green-700 mt-2">
                  Guaranteed Profit: ${outcomes[0].profit} ({( (outcomes[0].profit / parseFloat(totalStake)) * 100).toFixed(2)}%)
                </p>
              )}
            </div>
          </div>
          
          <div className="p-5 bg-blue-50 rounded-xl border border-blue-100">
            <h4 className="text-xs font-bold text-blue-700 uppercase mb-2">What is Arbitrage?</h4>
            <p className="text-xs text-blue-900 leading-relaxed">
              Arbing involves placing bets on all possible outcomes of an event with different bookmakers to lock in a profit regardless of the result.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArbCalculator;
