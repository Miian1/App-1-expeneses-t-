
import React, { useState } from 'react';
import { AppState, TransactionType } from '../types';
import { AlertCircle, CheckCircle2, Save, Target } from 'lucide-react';

interface Props {
  state: AppState;
  onUpdate: (limit: number) => void;
}

const Budget: React.FC<Props> = ({ state, onUpdate }) => {
  const [limit, setLimit] = useState(state.budget.toString());
  const [isSaved, setIsSaved] = useState(false);

  const totalExpense = state.transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((acc, t) => acc + t.amount, 0);

  const progress = (totalExpense / state.budget) * 100;
  const isOver = totalExpense > state.budget;

  const handleSave = () => {
    onUpdate(parseFloat(limit));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="p-6 space-y-8 animate-in slide-in-from-top-10 duration-500">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Monthly Budget</h1>

      <div className="bg-white dark:bg-[#1E293B] p-8 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm dark:shadow-none space-y-8 relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Target size={120} className="text-slate-900 dark:text-white" />
        </div>
        
        <div className="space-y-2 text-center relative z-10">
          <p className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-widest font-bold">Monthly Limit</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl text-slate-400 dark:text-slate-500">{state.currency}</span>
            <input 
              type="number"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              className="bg-transparent text-5xl font-bold w-48 text-center focus:outline-none text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <button 
          onClick={handleSave}
          className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all text-white ${
            isSaved ? 'bg-emerald-500' : 'bg-sky-500 shadow-lg shadow-sky-500/20'
          }`}
        >
          {isSaved ? <CheckCircle2 size={20} /> : <Save size={20} />}
          {isSaved ? 'Limit Updated' : 'Update Limit'}
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900/50 p-6 rounded-3xl border border-black/5 dark:border-white/5 shadow-sm dark:shadow-none space-y-6 transition-colors duration-300">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-slate-800 dark:text-slate-200">Budget Usage</h3>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
            isOver ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'
          }`}>
            {isOver ? 'Exceeded' : 'On Track'}
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Spent: {state.currency} {totalExpense.toLocaleString()}</span>
            <span className="text-slate-500 dark:text-slate-400 font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-1">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${
                progress > 90 ? 'bg-rose-500' : progress > 70 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
        </div>

        {progress > 80 && (
          <div className={`p-4 rounded-2xl flex items-start gap-3 border ${
            isOver ? 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-300' : 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-300'
          }`}>
            <AlertCircle className="shrink-0" size={18} />
            <p className="text-xs font-medium leading-relaxed">
              {isOver 
                ? "You've exceeded your budget! Consider reviewing your misc expenses."
                : "You're approaching your monthly limit. Be careful with your next few transactions."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Budget;
