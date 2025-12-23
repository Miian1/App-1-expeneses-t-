
import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType, Category, CategoryInfo } from '../types';
import { ICON_LIBRARY, getCategoryIcon } from '../constants';
import { Search, Trash2, CalendarDays } from 'lucide-react';

interface Props {
  transactions: Transaction[];
  categories: CategoryInfo[];
  onDelete: (id: string) => void;
  currency: string;
}

const History: React.FC<Props> = ({ transactions, categories, onDelete, currency }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [activeType, setActiveType] = useState<TransactionType | 'All'>('All');

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.category.toLowerCase().includes(search.toLowerCase()) || 
                           t.notes?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
      const matchesType = activeType === 'All' || t.type === activeType;
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [transactions, search, activeCategory, activeType]);

  const groupedTransactions = useMemo(() => {
    const groups: Record<string, Transaction[]> = {};
    filteredTransactions.forEach(t => {
      const date = new Date(t.date).toLocaleDateString('en-US', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long' 
      });
      if (!groups[date]) groups[date] = [];
      groups[date].push(t);
    });
    return groups;
  }, [filteredTransactions]);

  return (
    <div className="p-6 space-y-6 animate-in slide-in-from-right-10 duration-500 pb-24">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">History</h1>
        <div className="text-slate-500 dark:text-slate-400 text-xs font-semibold bg-white dark:bg-slate-800/50 px-3 py-1 rounded-full border border-black/5 dark:border-white/5">
          {filteredTransactions.length} items
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
          <input 
            placeholder="Search by category or notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-black/5 dark:border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all shadow-sm dark:shadow-none"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {(['All', TransactionType.EXPENSE, TransactionType.INCOME] as const).map(type => (
            <button 
              key={type}
              onClick={() => setActiveType(type)}
              className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all whitespace-nowrap ${
                activeType === type ? 'bg-sky-500 border-sky-500 text-white shadow-lg shadow-sky-500/20' : 'bg-white dark:bg-slate-900 border-black/5 dark:border-white/5 text-slate-400'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {['All', ...categories.map(c => c.name)].map(catName => (
            <button 
              key={catName}
              onClick={() => setActiveCategory(catName)}
              className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all whitespace-nowrap ${
                activeCategory === catName ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent' : 'bg-white dark:bg-slate-900 border-black/5 dark:border-white/5 text-slate-400'
              }`}
            >
              {catName}
            </button>
          ))}
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-full border border-black/5 dark:border-white/5">
            <CalendarDays size={48} className="opacity-20" />
          </div>
          <p className="font-medium">No results found.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedTransactions).map(([date, txs]) => (
            <div key={date} className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">{date}</h3>
              <div className="space-y-2">
                {(txs as Transaction[]).map((tx) => (
                  <div key={tx.id} className="group relative bg-white dark:bg-[#1E293B] p-4 rounded-3xl border border-black/5 dark:border-white/5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm dark:shadow-none">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-sky-600 dark:text-sky-400">
                        {getCategoryIcon(categories, tx.category)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-200">{tx.category}</p>
                        <p className="text-xs text-slate-500 truncate w-32">{tx.notes || 'No description'}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <div>
                        <p className={`font-bold ${tx.type === TransactionType.EXPENSE ? 'text-rose-500' : 'text-emerald-500'}`}>
                          {tx.type === TransactionType.EXPENSE ? '-' : '+'}
                          {currency} {tx.amount.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <button 
                        onClick={() => onDelete(tx.id)}
                        className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
