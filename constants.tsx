
import React from 'react';
import { 
  Utensils, Coffee, Bus, Shirt, Home, Layers, LayoutDashboard, 
  PlusCircle, History as HistoryIcon, Settings, Briefcase, Wifi, Book, 
  Gamepad2, Stethoscope, Dumbbell, Plane, Music, Gift, 
  ShoppingBag, Zap, Smartphone, CreditCard, Wrench, Library, BarChart3
} from 'lucide-react';
import { CategoryInfo, LanguageCode } from './types';

export const COLORS = {
  background: '#0F172A',
  card: '#1E293B',
  accent: '#38BDF8',
  income: '#22C55E',
  expense: '#EF4444',
  warning: '#F59E0B',
  text: '#F8FAFC',
  muted: '#94A3B8'
};

export const ICON_LIBRARY: Record<string, React.ReactNode> = {
  food: <Utensils size={20} />,
  coffee: <Coffee size={20} />,
  bus: <Bus size={20} />,
  shirt: <Shirt size={20} />,
  home: <Home size={20} />,
  wifi: <Wifi size={20} />,
  book: <Book size={20} />,
  game: <Gamepad2 size={20} />,
  health: <Stethoscope size={20} />,
  gym: <Dumbbell size={20} />,
  travel: <Plane size={20} />,
  music: <Music size={20} />,
  gift: <Gift size={20} />,
  shopping: <ShoppingBag size={20} />,
  utility: <Zap size={20} />,
  phone: <Smartphone size={20} />,
  card: <CreditCard size={20} />,
  tool: <Wrench size={20} />,
  study: <Library size={20} />,
  misc: <Layers size={20} />
};

export const DEFAULT_CATEGORIES: CategoryInfo[] = [
  { id: '1', name: 'Food', iconName: 'food' },
  { id: '2', name: 'Snacks', iconName: 'coffee' },
  { id: '3', name: 'Transport', iconName: 'bus' },
  { id: '4', name: 'Laundry', iconName: 'shirt' },
  { id: '5', name: 'Stationary', iconName: 'book' },
  { id: '6', name: 'Internet', iconName: 'wifi' },
  { id: '7', name: 'Misc', iconName: 'misc' },
];

export const getCategoryIcon = (categories: CategoryInfo[], categoryName: string) => {
  const cat = categories.find(c => c.name === categoryName);
  return ICON_LIBRARY[cat?.iconName || 'misc'] || <Layers size={20} />;
};

export const CURRENCIES = [
  { code: 'PKR', symbol: 'Rs', name: 'Pakistani Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
];

export const LANGUAGES: { code: LanguageCode, name: string, native: string }[] = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'ur', name: 'Urdu', native: 'اردو' },
  { code: 'ar', name: 'Arabic', native: 'العربية' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'zh', name: 'Chinese', native: '中文' },
  { code: 'id', name: 'Indonesian', native: 'Bahasa' },
  { code: 'ja', name: 'Japanese', native: '日本語' },
  { code: 'de', name: 'German', native: 'Deutsch' },
  { code: 'it', name: 'Italian', native: 'Italiano' },
];

const enTranslations = {
  home: "Home", analytics: "Analytics", add: "Add", tools: "Tools", settings: "Settings",
  balance: "Current Balance", safeSpend: "Daily Safe Spend", budget: "Monthly Budget",
  income: "Income", expense: "Expense", totalIncome: "Total Income", totalExpense: "Total Expense",
  remaining: "remaining", left: "left", history: "History", udhaar: "Udhaar", goals: "Goals",
  categories: "Categories", person: "Person", amount: "Amount", save: "Save", cancel: "Cancel",
  owe: "I Owe", owed: "Owes Me", target: "Target", saved: "Saved", contribute: "Contribute",
  week: "Week", month: "Month", quarter: "3 Months", custom: "Custom", developer: "Mian Khizar",
  language: "Language", currency: "Currency", theme: "Theme", appearance: "Appearance",
  export: "Export Data", import: "Import Backup", reset: "Reset All", version: "Version",
  safeMsg: "Based on days remaining this month", filter: "Filter", all: "All",
  placeholder_notes: "Add notes (optional)...", placeholder_amount: "0.00",
  contribute_msg: "How much did you save today?", no_data: "No transactions found.",
  inc_vs_exp: "Income vs Expense", cat_breakdown: "Category Breakdown", top_exp: "Top Expenses",
  'Select Currency': "Select Currency", 'Select Language': "Select Language", 'Copied!': "Copied to clipboard!",
  view_analytics: "View Reports", view_history: "View All Activity", reset_confirm: "Are you sure you want to reset everything? This cannot be undone."
};

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: enTranslations,
  ur: {
    home: "ہوم", analytics: "تجزیہ", add: "شامل کریں", tools: "اوزار", settings: "سیٹنگز",
    balance: "موجودہ بیلنس", safeSpend: "روزانہ کا خرچہ", budget: "ماہانہ بجٹ",
    income: "آمدنی", expense: "خرچہ", totalIncome: "کل آمدنی", totalExpense: "کل خرچہ",
    remaining: "باقی", left: "باقی", history: "تاریخ", udhaar: "ادھار", goals: "اہداف",
    categories: "اقسام", person: "شخص", amount: "رقم", save: "محفوظ کریں", cancel: "منسوخ",
    owe: "میں نے دینے ہیں", owed: "مجھے ملنے ہیں", target: "ہدف", saved: "بچت", contribute: "حصہ ڈالیں",
    week: "ہفتہ", month: "مہینہ", quarter: "3 ماہ", custom: "مرضی سے", developer: "میاں خضر",
    language: "زبان", currency: "کرنسی", theme: "تھیم", appearance: "ظاہری شکل",
    export: "ڈیٹا نکالیں", import: "بیک اپ لائیں", reset: "سب صاف کریں", version: "ورژن",
    safeMsg: "اس مہینے کے باقی دنوں کی بنیاد پر", filter: "فلٹر", all: "سب",
    placeholder_notes: "نوٹس لکھیں...", placeholder_amount: "0.00",
    contribute_msg: "آج آپ نے کتنی بچت کی؟", no_data: "کوئی لین دین نہیں ملا۔",
    inc_vs_exp: "آمدنی بمقابلہ خرچہ", cat_breakdown: "اقسام کی تفصیل", top_exp: "بڑے اخراجات",
    'Select Currency': "کرنسی منتخب کریں", 'Select Language': "زبان منتخب کریں", 'Copied!': "کاپی ہو گیا!",
    view_analytics: "رپورٹس دیکھیں", view_history: "تمام لین دین", reset_confirm: "کیا آپ واقعی سب کچھ ختم کرنا چاہتے ہیں؟"
  },
  fr: enTranslations, zh: enTranslations, id: enTranslations, ar: enTranslations, ja: enTranslations, de: enTranslations, it: enTranslations
};

export const TABS = (t: (k: string) => string) => [
  { id: 'dashboard', label: t('home'), icon: <LayoutDashboard size={24} /> },
  { id: 'history', label: t('history'), icon: <HistoryIcon size={24} /> },
  { id: 'add', label: t('add'), icon: <PlusCircle size={32} /> },
  { id: 'manager', label: t('tools'), icon: <Briefcase size={24} /> },
  { id: 'settings', label: t('settings'), icon: <Settings size={24} /> },
];
