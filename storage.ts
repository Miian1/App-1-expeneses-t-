
import { AppState, Transaction, Debt, Goal } from './types';
import { DEFAULT_CATEGORIES } from './constants';

const STORAGE_KEY = 'hostel_tracker_data_v4';

const DEFAULT_STATE: AppState = {
  transactions: [],
  debts: [],
  goals: [],
  categories: DEFAULT_CATEGORIES,
  budget: 5000,
  currency: 'PKR',
  language: 'en',
  theme: 'dark'
};

export const loadData = (): AppState => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return DEFAULT_STATE;
  try {
    const parsed = JSON.parse(data);
    return {
      ...DEFAULT_STATE,
      ...parsed
    };
  } catch (e) {
    return DEFAULT_STATE;
  }
};

export const saveData = (state: AppState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const exportData = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return;
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `hostel_tracker_backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importData = async (file: File): Promise<AppState | null> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        resolve(data);
      } catch (err) {
        resolve(null);
      }
    };
    reader.readAsText(file);
  });
};
