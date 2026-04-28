
import React from 'react';
import { OddsFormat } from '../types';
import { useSettings } from '../App';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { oddsFormat, setOddsFormat } = useSettings();

  if (!isOpen) return null;

  const formats = [
    { value: OddsFormat.DECIMAL, label: 'Decimal', example: '2.50' },
    { value: OddsFormat.FRACTIONAL, label: 'Fractional', example: '6/4' },
    { value: OddsFormat.AMERICAN, label: 'American', example: '+150' },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-xl font-bold text-slate-800">App Settings</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        
        <div className="p-8 space-y-8">
          <div>
            <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">
              Default Odds Format
            </label>
            <div className="grid grid-cols-1 gap-3">
              {formats.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setOddsFormat(f.value)}
                  className={`
                    flex items-center justify-between p-4 rounded-2xl border-2 transition-all
                    ${oddsFormat === f.value 
                      ? 'border-blue-600 bg-blue-50 ring-4 ring-blue-50' 
                      : 'border-slate-100 hover:border-slate-200 bg-white'}
                  `}
                >
                  <div className="flex flex-col text-left">
                    <span className={`font-bold ${oddsFormat === f.value ? 'text-blue-700' : 'text-slate-700'}`}>
                      {f.label}
                    </span>
                    <span className="text-xs text-slate-400">Example: {f.example}</span>
                  </div>
                  {oddsFormat === f.value && (
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white">
                      <i className="fa-solid fa-check text-xs"></i>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-400 text-center leading-relaxed">
              Global settings update all calculators in real-time. Preferences are saved for your current session.
            </p>
          </div>
        </div>

        <div className="p-6 bg-slate-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
