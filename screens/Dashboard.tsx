
import React, { useMemo } from 'react';
import { AppState, TabType, TransactionType } from '../types';
import { Wallet, Info, CalendarDays, TrendingUp, TrendingDown } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from 'recharts';

interface Props {
  state: AppState;
  t: (k: string) => string;
  onNav: (tab: TabType) => void;
}

const Dashboard: React.FC<Props> = ({ state, t, onNav }) => {
  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Safe Spend Logic: Only transactions from THIS calendar month
    const monthlyTransactions = state.transactions.filter(tx => {
      const d = new Date(tx.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const income = state.transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((acc, t) => acc + t.amount, 0);
    
    const expense = state.transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((acc, t) => acc + t.amount, 0);

    const monthlyExpense = monthlyTransactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((acc, t) => acc + t.amount, 0);

    const balance = income - expense;
    const remainingBudget = Math.max(0, state.budget - monthlyExpense);
    
    const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysLeft = Math.max(1, lastDay - now.getDate() + 1); // Includes today
    const dailySafeSpend = Math.floor(remainingBudget / daysLeft);

    // Chart Data for last 7 days
    const chartData = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dayStr = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayExpense = state.transactions
        .filter(tx => tx.type === TransactionType.EXPENSE && new Date(tx.date).toDateString() === d.toDateString())
        .reduce((sum, tx) => sum + tx.amount, 0);
      return { name: dayStr, amount: dayExpense };
    });
    
    return { income, expense, balance, remainingBudget, dailySafeSpend, chartData };
  }, [state.transactions, state.budget]);

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500 pb-24">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Hostel Tracker</h1>
          <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold flex items-center gap-1 uppercase tracking-widest">
            <Info size={10} /> 100% Offline
          </p>
        </div>
        <div className="bg-sky-500/10 p-2 rounded-xl text-sky-500">
          <Wallet size={24} />
        </div>
      </div>

      {/* Balance Section */}
      <div className="text-center py-2">
        <p className="text-slate-500 text-xs uppercase tracking-widest mb-1 font-bold">{t('balance')}</p>
        <h2 className="text-5xl font-bold text-slate-900 dark:text-white">
          <span className="text-2xl text-slate-400 font-normal mr-1">{state.currency}</span>
          {stats.balance.toLocaleString()}
        </h2>
      </div>

      {/* Stats Row (Income/Expenses) */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-emerald-500/10 p-4 rounded-3xl border border-emerald-500/10">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={14} className="text-emerald-500" />
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest">{t('totalIncome')}</p>
          </div>
          <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{state.currency} {stats.income.toLocaleString()}</p>
        </div>
        <div className="bg-rose-500/10 p-4 rounded-3xl border border-rose-500/10">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown size={14} className="text-rose-500" />
            <p className="text-[10px] text-rose-600 dark:text-rose-400 font-bold uppercase tracking-widest">{t('totalExpense')}</p>
          </div>
          <p className="text-lg font-bold text-rose-600 dark:text-rose-400">{state.currency} {stats.expense.toLocaleString()}</p>
        </div>
      </div>

      {/* Daily Safe Spend Card */}
      <div className="bg-gradient-to-br from-sky-500 to-indigo-600 p-6 rounded-[2.5rem] text-white shadow-xl shadow-sky-500/20 space-y-4 relative overflow-hidden transition-all hover:scale-[1.01]">
        <div className="absolute -right-4 -top-4 opacity-10"><CalendarDays size={120} /></div>
        <div className="relative z-10">
          <p className="text-sky-100 text-[10px] font-bold uppercase tracking-widest">{t('safeSpend')}</p>
          <h3 className="text-4xl font-bold">{state.currency} {stats.dailySafeSpend.toLocaleString()}</h3>
          <p className="text-sky-100 text-xs mt-1 font-medium">{t('safeMsg')}</p>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="bg-white dark:bg-[#1E293B] p-5 rounded-[2rem] border border-black/5 dark:border-white/5 space-y-4 shadow-sm">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Weekly Activity</h3>
        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.chartData}>
              <Bar dataKey="amount" fill="#38BDF8" radius={[4, 4, 0, 0]} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} />
              <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '10px' }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Budget Progress */}
      <div className="bg-white dark:bg-[#1E293B] p-6 rounded-[2rem] border border-black/5 dark:border-white/5 space-y-4 shadow-sm">
        <div className="flex justify-between items-end">
          <h3 className="font-bold text-slate-800 dark:text-slate-200">{t('budget')}</h3>
          <p className="text-xs text-slate-500">{state.currency} {stats.remainingBudget.toLocaleString()} {t('left')}</p>
        </div>
        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 rounded-full ${
              (stats.remainingBudget / state.budget) < 0.1 ? 'bg-rose-500' : 'bg-sky-500'
            }`}
            style={{ width: `${Math.min(100, (1 - stats.remainingBudget / state.budget) * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
