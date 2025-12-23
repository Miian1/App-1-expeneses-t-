
import React, { useState } from 'react';
import { AppState, Debt, Goal, CategoryInfo } from '../types';
import { ICON_LIBRARY } from '../constants';
import { Plus, Trash2, Users, Target, PiggyBank, Layers, ChevronRight } from 'lucide-react';

interface Props {
  state: AppState;
  updateDebts: (debts: Debt[]) => void;
  updateGoals: (goals: Goal[]) => void;
  updateCategories: (categories: CategoryInfo[]) => void;
}

const Manager: React.FC<Props> = ({ state, updateDebts, updateGoals, updateCategories }) => {
  const [activeSubTab, setActiveSubTab] = useState<'udhaar' | 'goals' | 'categories'>('udhaar');
  const [showAdd, setShowAdd] = useState(false);
  const [showGoalContribution, setShowGoalContribution] = useState<string | null>(null);

  // Form states
  const [person, setPerson] = useState('');
  const [amount, setAmount] = useState('');
  const [debtType, setDebtType] = useState<'owe' | 'owed'>('owe');
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [contribution, setContribution] = useState('');
  const [newCatName, setNewCatName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('misc');

  const addDebt = () => {
    if (!person || !amount) return;
    const newDebt: Debt = {
      id: Date.now().toString(),
      person,
      amount: parseFloat(amount),
      type: debtType
    };
    updateDebts([...state.debts, newDebt]);
    resetForm();
  };

  const addGoal = () => {
    if (!goalName || !goalTarget) return;
    const newGoal: Goal = {
      id: Date.now().toString(),
      name: goalName,
      target: parseFloat(goalTarget),
      current: 0
    };
    updateGoals([...state.goals, newGoal]);
    resetForm();
  };

  const addCategory = () => {
    if (!newCatName) return;
    const newCat: CategoryInfo = {
      id: Date.now().toString(),
      name: newCatName,
      iconName: selectedIcon
    };
    updateCategories([...state.categories, newCat]);
    resetForm();
  };

  const handleContribute = () => {
    if (!contribution || !showGoalContribution) return;
    const updatedGoals = state.goals.map(g => {
      if (g.id === showGoalContribution) {
        return { ...g, current: g.current + parseFloat(contribution) };
      }
      return g;
    });
    updateGoals(updatedGoals);
    setContribution('');
    setShowGoalContribution(null);
  };

  const resetForm = () => {
    setPerson('');
    setAmount('');
    setGoalName('');
    setGoalTarget('');
    setNewCatName('');
    setSelectedIcon('misc');
    setShowAdd(false);
  };

  const deleteDebt = (id: string) => updateDebts(state.debts.filter(d => d.id !== id));
  const deleteGoal = (id: string) => updateGoals(state.goals.filter(g => g.id !== id));
  const deleteCategory = (id: string) => {
    if (state.categories.length <= 1) return;
    updateCategories(state.categories.filter(c => c.id !== id));
  };

  const totalOwe = state.debts.filter(d => d.type === 'owe').reduce((a, b) => a + b.amount, 0);
  const totalOwed = state.debts.filter(d => d.type === 'owed').reduce((a, b) => a + b.amount, 0);

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500 pb-24">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Manager</h1>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-sky-500 text-white p-2 rounded-xl shadow-lg shadow-sky-500/20 active:scale-95 transition-transform"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="flex bg-white dark:bg-slate-900 p-1 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setActiveSubTab('udhaar')}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${activeSubTab === 'udhaar' ? 'bg-slate-100 dark:bg-slate-800 text-sky-500' : 'text-slate-500'}`}
        >
          <Users size={16} /> Udhaar
        </button>
        <button 
          onClick={() => setActiveSubTab('goals')}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${activeSubTab === 'goals' ? 'bg-slate-100 dark:bg-slate-800 text-sky-500' : 'text-slate-500'}`}
        >
          <Target size={16} /> Goals
        </button>
        <button 
          onClick={() => setActiveSubTab('categories')}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${activeSubTab === 'categories' ? 'bg-slate-100 dark:bg-slate-800 text-sky-500' : 'text-slate-500'}`}
        >
          <Layers size={16} /> Categories
        </button>
      </div>

      {activeSubTab === 'udhaar' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-500/10 p-4 rounded-3xl border border-emerald-500/10">
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest">They Owe Me</p>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{state.currency} {totalOwed}</p>
            </div>
            <div className="bg-rose-500/10 p-4 rounded-3xl border border-rose-500/10">
              <p className="text-[10px] text-rose-600 dark:text-rose-400 font-bold uppercase tracking-widest">I Owe Them</p>
              <p className="text-xl font-bold text-rose-600 dark:text-rose-400">{state.currency} {totalOwe}</p>
            </div>
          </div>
          <div className="space-y-3">
            {state.debts.length === 0 ? <p className="text-center py-10 text-slate-400 text-sm">No pending udhaar.</p> : state.debts.map(debt => (
              <div key={debt.id} className="bg-white dark:bg-[#1E293B] p-4 rounded-2xl border border-black/5 dark:border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${debt.type === 'owe' ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                    <Users size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{debt.person}</p>
                    <p className="text-[10px] uppercase font-bold text-slate-400">{debt.type === 'owe' ? 'I Owe' : 'Owes Me'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className={`font-bold ${debt.type === 'owe' ? 'text-rose-500' : 'text-emerald-500'}`}>{state.currency} {debt.amount}</p>
                  <button onClick={() => deleteDebt(debt.id)} className="text-slate-300 hover:text-rose-500"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'goals' && (
        <div className="space-y-4">
          {state.goals.length === 0 ? <p className="text-center py-10 text-slate-400 text-sm">No savings goals yet.</p> : state.goals.map(goal => {
            const progress = Math.min(100, (goal.current / goal.target) * 100);
            return (
              <div key={goal.id} className="bg-white dark:bg-[#1E293B] p-5 rounded-3xl border border-black/5 dark:border-white/5 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-sky-500/10 rounded-xl text-sky-500"><PiggyBank size={20} /></div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{goal.name}</h4>
                      <p className="text-xs text-slate-400">{state.currency} {goal.target.toLocaleString()} target</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setShowGoalContribution(goal.id)} className="bg-emerald-500/10 text-emerald-500 p-2 rounded-lg hover:bg-emerald-500/20"><Plus size={16} /></button>
                    <button onClick={() => deleteGoal(goal.id)} className="text-slate-300 p-2"><Trash2 size={16} /></button>
                  </div>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-500 transition-all duration-1000" style={{ width: `${progress}%` }} />
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase">
                  <span>{Math.round(progress)}% Complete</span>
                  <span className="text-sky-500">{state.currency} {goal.current.toLocaleString()} saved</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeSubTab === 'categories' && (
        <div className="space-y-4">
          {state.categories.map(cat => (
            <div key={cat.id} className="bg-white dark:bg-[#1E293B] p-4 rounded-2xl border border-black/5 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-sky-500">
                  {ICON_LIBRARY[cat.iconName]}
                </div>
                <p className="font-bold text-slate-900 dark:text-white">{cat.name}</p>
              </div>
              <button onClick={() => deleteCategory(cat.id)} className="text-slate-300 hover:text-rose-500 p-2">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          <p className="text-center text-[10px] text-slate-400 uppercase font-bold tracking-widest pt-4">You can use these when adding transactions</p>
        </div>
      )}

      {/* Goal Contribution Modal */}
      {showGoalContribution && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-6">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-[2rem] p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-center">Add Savings Progress</h3>
            <p className="text-xs text-slate-500 text-center">How much did you save today?</p>
            <input type="number" autoFocus placeholder="Contribution amount" value={contribution} onChange={e => setContribution(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-black/5 dark:border-white/5 text-center text-xl font-bold focus:outline-none" />
            <div className="flex gap-3">
              <button onClick={() => setShowGoalContribution(null)} className="flex-1 py-3 text-slate-400 font-bold">Cancel</button>
              <button onClick={handleContribute} className="flex-1 bg-sky-500 text-white py-3 rounded-xl font-bold">Add</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal Overlay */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-md mx-auto bg-white dark:bg-[#1E293B] rounded-[2.5rem] p-8 space-y-6 animate-in slide-in-from-bottom-10 max-h-[90vh] overflow-y-auto no-scrollbar">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white text-center">
              Add {activeSubTab === 'udhaar' ? 'Udhaar' : activeSubTab === 'goals' ? 'Savings Goal' : 'Category'}
            </h3>
            
            {activeSubTab === 'udhaar' && (
              <div className="space-y-4">
                <input placeholder="Person Name" value={person} onChange={e => setPerson(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-black/5 dark:border-white/5 text-sm focus:outline-none" />
                <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-black/5 dark:border-white/5 text-sm focus:outline-none" />
                <div className="flex gap-2">
                  <button onClick={() => setDebtType('owe')} className={`flex-1 py-3 rounded-xl text-xs font-bold ${debtType === 'owe' ? 'bg-rose-500 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>I Owe</button>
                  <button onClick={() => setDebtType('owed')} className={`flex-1 py-3 rounded-xl text-xs font-bold ${debtType === 'owed' ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>Owes Me</button>
                </div>
                <button onClick={addDebt} className="w-full bg-sky-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-sky-500/20">Save Udhaar</button>
              </div>
            )}

            {activeSubTab === 'goals' && (
              <div className="space-y-4">
                <input placeholder="Goal Name (e.g. New Phone)" value={goalName} onChange={e => setGoalName(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-black/5 dark:border-white/5 text-sm focus:outline-none" />
                <input type="number" placeholder="Target Amount" value={goalTarget} onChange={e => setGoalTarget(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-black/5 dark:border-white/5 text-sm focus:outline-none" />
                <button onClick={addGoal} className="w-full bg-sky-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-sky-500/20">Create Goal</button>
              </div>
            )}

            {activeSubTab === 'categories' && (
              <div className="space-y-6">
                <input placeholder="Category Name" value={newCatName} onChange={e => setNewCatName(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-black/5 dark:border-white/5 text-sm focus:outline-none font-bold" />
                <div className="space-y-3">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest px-1">Select Icon</p>
                  <div className="grid grid-cols-5 gap-3 max-h-48 overflow-y-auto no-scrollbar p-1">
                    {Object.keys(ICON_LIBRARY).map(iconKey => (
                      <button 
                        key={iconKey}
                        onClick={() => setSelectedIcon(iconKey)}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${selectedIcon === iconKey ? 'bg-sky-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}
                      >
                        {ICON_LIBRARY[iconKey]}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={addCategory} className="w-full bg-sky-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-sky-500/20">Create Category</button>
              </div>
            )}
            
            <button onClick={resetForm} className="w-full text-slate-400 text-sm font-medium">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Manager;
