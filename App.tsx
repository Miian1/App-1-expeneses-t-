
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AppState, TabType, Transaction, Debt, Goal, CategoryInfo, LanguageCode } from './types';
import { loadData, saveData } from './storage';
import { TABS, DEFAULT_CATEGORIES, TRANSLATIONS } from './constants';
import Dashboard from './screens/Dashboard';
import AddTransaction from './screens/AddTransaction';
import Analytics from './screens/Analytics';
import Manager from './screens/Manager';
import Settings from './screens/Settings';
import Budget from './screens/Budget';
import History from './screens/History';
import { Target } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(loadData());
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const t = useCallback((key: string) => {
    return TRANSLATIONS[state.language][key] || key;
  }, [state.language]);

  const isRTL = useMemo(() => ['ur', 'ar'].includes(state.language), [state.language]);

  useEffect(() => {
    saveData(state);
    // Apply theme from state
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [state, isRTL]);

  const addTransaction = useCallback((tx: Transaction) => {
    setState(prev => ({
      ...prev,
      transactions: [tx, ...prev.transactions]
    }));
    setActiveTab('dashboard');
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      transactions: prev.transactions.filter(t => t.id !== id)
    }));
  }, []);

  const updateDebts = useCallback((debts: Debt[]) => {
    setState(prev => ({ ...prev, debts }));
  }, []);

  const updateGoals = useCallback((goals: Goal[]) => {
    setState(prev => ({ ...prev, goals }));
  }, []);

  const updateCategories = useCallback((categories: CategoryInfo[]) => {
    setState(prev => ({ ...prev, categories }));
  }, []);

  const updateBudget = useCallback((limit: number) => {
    setState(prev => ({ ...prev, budget: limit }));
  }, []);

  const updateConfig = useCallback((updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const resetData = useCallback(() => {
    setState({
      transactions: [], debts: [], goals: [],
      categories: DEFAULT_CATEGORIES, budget: 5000,
      currency: 'PKR', language: 'en', theme: 'dark'
    });
  }, []);

  const renderScreen = () => {
    const props = { state, t, currency: state.currency };
    switch (activeTab) {
      case 'dashboard': return <Dashboard {...props} onNav={setActiveTab} />;
      case 'history': return <History transactions={state.transactions} categories={state.categories} onDelete={deleteTransaction} currency={state.currency} />;
      case 'analytics': return <Analytics {...props} onDelete={deleteTransaction} />;
      case 'add': return <AddTransaction onAdd={addTransaction} categories={state.categories} t={t} />;
      case 'manager': return <Manager {...props} updateDebts={updateDebts} updateGoals={updateGoals} updateCategories={updateCategories} />;
      case 'settings': return <Settings {...props} onReset={resetData} onImport={setState} onUpdateConfig={updateConfig} onNav={setActiveTab} />;
      case 'budget': return <Budget {...props} onUpdate={updateBudget} />;
      default: return <Dashboard {...props} onNav={setActiveTab} />;
    }
  };

  return (
    <div className={`flex flex-col h-screen max-w-md mx-auto relative shadow-2xl overflow-hidden transition-colors duration-300 ${state.theme === 'dark' ? 'bg-[#0F172A]' : 'bg-slate-50'}`}>
      <main className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {renderScreen()}
      </main>

      {activeTab === 'dashboard' && (
        <button 
          onClick={() => setActiveTab('budget')}
          className={`fixed bottom-24 ${isRTL ? 'left-6' : 'right-6'} p-4 bg-amber-500 rounded-full shadow-lg text-white hover:scale-110 transition-transform active:scale-95 z-50`}
        >
          <Target size={24} />
        </button>
      )}

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto glass-morphism h-20 px-2 flex items-center justify-between z-50 rounded-t-3xl border-t border-black/5 dark:border-white/10 safe-bottom transition-colors duration-300">
        {TABS(t).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex flex-col items-center justify-center flex-1 transition-all ${
              activeTab === tab.id 
                ? 'text-sky-500 dark:text-sky-400 scale-110 -translate-y-1' 
                : 'text-slate-400 dark:text-slate-500 hover:text-sky-400'
            }`}
          >
            <div className={`${tab.id === 'add' ? 'bg-sky-500 p-2 rounded-full text-white shadow-lg shadow-sky-500/20' : ''}`}>
              {tab.icon}
            </div>
            {tab.id !== 'add' && <span className="text-[9px] mt-1 font-bold whitespace-nowrap">{tab.label}</span>}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
