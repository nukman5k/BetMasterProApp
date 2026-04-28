
import React, { useState } from 'react';
import { decimalToAmerican, decimalToFractional } from '../../utils/calculations';

const OddsConverter: React.FC = () => {
  const [decimal, setDecimal] = useState<string>('2.00');

  const handleDecimalChange = (val: string) => {
    setDecimal(val);
  };

  const d = parseFloat(decimal) || 1;
  const american = decimalToAmerican(d);
  const fractional = decimalToFractional(d);
  const probability = ((1 / d) * 100).toFixed(2);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <i className="fa-solid fa-right-left text-4xl text-blue-600 mb-4"></i>
        <h2 className="text-2xl font-bold">Instant Odds Conversion</h2>
        <p className="text-slate-500">Enter any decimal odds to see all other formats instantly.</p>
      </div>

      <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
        <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 text-center">Decimal Odds</label>
        <input 
          type="number" 
          step="0.01"
          value={decimal}
          onChange={(e) => handleDecimalChange(e.target.value)}
          className="w-full text-center text-5xl font-black bg-white border-2 border-slate-200 rounded-2xl py-6 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-sm"
          placeholder="2.00"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
          <p className="text-xs font-bold text-slate-400 uppercase mb-2">American</p>
          <p className="text-2xl font-bold text-slate-800">{american}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
          <p className="text-xs font-bold text-slate-400 uppercase mb-2">Fractional</p>
          <p className="text-2xl font-bold text-slate-800">{fractional}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
          <p className="text-xs font-bold text-slate-400 uppercase mb-2">Implied Probability</p>
          <p className="text-2xl font-bold text-slate-800">{probability}%</p>
        </div>
      </div>
    </div>
  );
};

export default OddsConverter;
