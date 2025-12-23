
export type Category = string;

export enum TransactionType {
  INCOME = 'Income',
  EXPENSE = 'Expense'
}

export interface CategoryInfo {
  id: string;
  name: string;
  iconName: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: Category;
  date: string; // ISO String
  notes?: string;
}

export interface Debt {
  id: string;
  person: string;
  amount: number;
  type: 'owe' | 'owed';
  note?: string;
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
}

export type LanguageCode = 'en' | 'fr' | 'zh' | 'id' | 'ar' | 'ja' | 'de' | 'it' | 'ur';

export interface AppState {
  transactions: Transaction[];
  debts: Debt[];
  goals: Goal[];
  categories: CategoryInfo[];
  budget: number;
  currency: string;
  language: LanguageCode;
  theme: 'dark' | 'light';
}

export type TabType = 'dashboard' | 'analytics' | 'add' | 'manager' | 'settings' | 'budget' | 'history';
