
import React, { useState } from 'react';
import { Category, TransactionType, Transaction, CategoryInfo } from '../types';
import { ICON_LIBRARY } from '../constants';
import { CheckCircle, Calendar, FileText } from 'lucide-react';

interface Props {
  onAdd: (tx: Transaction) => void;
  categories: CategoryInfo[];
}

const AddTransaction: React.FC<Props> = ({ onAdd, categories }) => {
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>(categories[0]?.name || 'Misc');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    onAdd({
      id: Date.now().toString(),
      amount: parseFloat(amount),
      type,
      category,
      notes,
      date: new Date().toISOString()
    });
  };

  return (
    <div className="p-6 space-y-8 animate-in slide-in-from-bottom-10 duration-500 pb-24">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">New Transaction</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type Toggle */}
        <div className="flex p-1.5 bg-white dark:bg-slate-900 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm dark:shadow-none">
          <button
            type="button"
            onClick={() => setType(TransactionType.EXPENSE)}
            className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
              type === TransactionType.EXPENSE ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => setType(TransactionType.INCOME)}
            className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
              type === TransactionType.INCOME ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Income
          </button>
        </div>

        {/* Amount Input */}
        <div className="text-center">
          <p className="text-slate-500 dark:text-slate-400 text-xs mb-2 uppercase tracking-widest font-bold">Amount</p>
          <div className="flex items-center justify-center gap-1">
            <span className="text-3xl text-slate-400 dark:text-slate-500 font-medium">PKR</span>
            <input 
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="bg-transparent text-5xl font-bold w-40 text-center focus:outline-none placeholder:text-slate-200 dark:placeholder:text-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Dynamic Category Grid */}
        <div className="space-y-3">
          <p className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-widest font-bold px-1">Category</p>
          <div className="grid grid-cols-3 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.name)}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                  category === cat.name 
                    ? 'bg-sky-500/10 border-sky-500 text-sky-600 dark:bg-sky-500/20 dark:border-sky-400 dark:text-sky-400' 
                    : 'bg-white border-black/5 text-slate-500 dark:bg-slate-900 dark:border-transparent dark:text-slate-400'
                }`}
              >
                {ICON_LIBRARY[cat.iconName]}
                <span className="text-[10px] mt-2 font-medium truncate w-full text-center px-1">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Details Fields */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-black/5 dark:border-white/5">
            <Calendar size={20} className="text-slate-400" />
            <input type="text" value="Today" disabled className="bg-transparent text-sm text-slate-600 dark:text-slate-300 w-full" />
          </div>
          <div className="flex items-start gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-black/5 dark:border-white/5">
            <FileText size={20} className="text-slate-400 mt-0.5" />
            <textarea 
              placeholder="Add notes (optional)..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-transparent text-sm text-slate-900 dark:text-slate-300 w-full focus:outline-none resize-none"
              rows={2}
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!amount}
          className="w-full bg-sky-500 py-5 rounded-3xl font-bold text-lg shadow-xl shadow-sky-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3 text-white"
        >
          <CheckCircle size={22} />
          Save Transaction
        </button>
      </form>
    </div>
  );
};

export default AddTransaction;
