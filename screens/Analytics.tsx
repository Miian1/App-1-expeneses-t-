
import React, { useMemo, useState } from 'react';
import { AppState, TransactionType, Transaction } from '../types';
import { COLORS, getCategoryIcon } from '../constants';
import { 
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, 
  Tooltip, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import { Search, Trash2, CalendarDays, ChevronDown, ListFilter } from 'lucide-react';

interface Props {
  state: AppState;
  t: (k: string) => string;
  onDelete: (id: string) => void;
  currency: string;
}

const Analytics: React.FC<Props> = ({ state, t, onDelete, currency }) => {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter' | 'all'>('month');
  const [search, setSearch] = useState('');

  const filteredData = useMemo(() => {
    const now = new Date();
    return state.transactions.filter(tx => {
      const txDate = new Date(tx.date);
      if (timeframe === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return txDate >= weekAgo;
      }
      if (timeframe === 'month') {
        return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
      }
      if (timeframe === 'quarter') {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(now.getMonth() - 3);
        return txDate >= threeMonthsAgo;
      }
      return true;
    });
  }, [state.transactions, timeframe]);

  const incomeVsExpense = useMemo(() => {
    const inc = filteredData.filter(tx => tx.type === TransactionType.INCOME).reduce((a, b) => a + b.amount, 0);
    const exp = filteredData.filter(tx => tx.type === TransactionType.EXPENSE).reduce((a, b) => a + b.amount, 0);
    return [
      { name: t('income'), value: inc, fill: COLORS.income },
      { name: t('expense'), value: exp, fill: COLORS.expense }
    ];
  }, [filteredData, t]);

  const categoryBreakdown = useMemo(() => {
    const data: Record<string, number> = {};
    filteredData.filter(tx => tx.type === TransactionType.EXPENSE).forEach(tx => {
      data[tx.category] = (data[tx.category] || 0) + tx.amount;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
  }, [filteredData]);

  const PIE_COLORS = ['#38BDF8', '#818CF8', '#FB7185', '#34D399', '#FBBF24', '#A78BFA'];

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500 pb-24">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('analytics')}</h1>
        <div className="relative">
          <select 
            value={timeframe} 
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="appearance-none bg-white dark:bg-slate-800 text-xs font-bold border border-black/5 dark:border-white/5 rounded-full px-4 py-2 pr-8 focus:outline-none shadow-sm"
          >
            <option value="week">{t('week')}</option>
            <option value="month">{t('month')}</option>
            <option value="quarter">{t('quarter')}</option>
            <option value="all">{t('all')}</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
        </div>
      </div>

      {/* Income vs Expense Card */}
      <div className="bg-white dark:bg-[#1E293B] p-6 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-500 uppercase tracking-widest">{t('inc_vs_exp')}</h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={incomeVsExpense} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
              <YAxis fontSize={10} axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '12px' }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Pie Chart */}
      <div className="bg-white dark:bg-[#1E293B] p-6 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-500 uppercase tracking-widest">{t('cat_breakdown')}</h3>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryBreakdown}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {categoryBreakdown.slice(0, 4).map((item, i) => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
              <span className="text-[10px] font-bold text-slate-500 truncate">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* History List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-bold text-sm text-slate-500 uppercase tracking-widest">{t('history')}</h3>
          <div className="flex items-center gap-2">
            <Search size={16} className="text-slate-400" />
            <input 
              placeholder={t('filter')} 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-xs focus:outline-none w-20 text-right"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filteredData.length === 0 ? (
            <p className="text-center py-10 text-slate-400 text-sm">{t('no_data')}</p>
          ) : (
            filteredData.slice(0, 20).map(tx => (
              <div key={tx.id} className="bg-white dark:bg-[#1E293B] p-4 rounded-2xl border border-black/5 dark:border-white/5 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-sky-500">
                    {getCategoryIcon(state.categories, tx.category)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-sm">{tx.category}</p>
                    <p className="text-[10px] text-slate-400">{new Date(tx.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-3">
                   <p className={`font-bold text-sm ${tx.type === TransactionType.EXPENSE ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {tx.type === TransactionType.EXPENSE ? '-' : '+'}{currency} {tx.amount}
                  </p>
                  <button onClick={() => onDelete(tx.id)} className="text-slate-300 hover:text-rose-500"><Trash2 size={16} /></button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
