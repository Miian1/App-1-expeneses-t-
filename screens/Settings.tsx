
import React, { useState, useRef } from 'react';
import { AppState, TabType } from '../types';
import { CURRENCIES, LANGUAGES } from '../constants';
import { exportData, importData } from '../storage';
import { 
  Coins, Linkedin, Mail, Languages as LangIcon, 
  ChevronRight, ExternalLink, Copy, X, DollarSign,
  Moon, Sun, BarChart3, Download, Upload, RefreshCw, History
} from 'lucide-react';

interface Props {
  state: AppState;
  t: (k: string) => string;
  onReset: () => void;
  onImport: (state: AppState) => void;
  onUpdateConfig: (updates: Partial<AppState>) => void;
  onNav: (tab: TabType) => void;
  currency: string;
}

interface ModalProps {
  title: string;
  children?: React.ReactNode;
  onClose: () => void;
}

const Modal = ({ title, children, onClose }: ModalProps) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
    <div className="bg-white dark:bg-[#1E293B] w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 space-y-6 animate-in slide-in-from-bottom-10 shadow-2xl">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
        <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500">
          <X size={20} />
        </button>
      </div>
      <div className="max-h-[60vh] overflow-y-auto no-scrollbar grid grid-cols-1 gap-2">
        {children}
      </div>
    </div>
  </div>
);

const Settings: React.FC<Props> = ({ state, t, onReset, onImport, onUpdateConfig, onNav }) => {
  const [activePopup, setActivePopup] = useState<'currency' | 'language' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const copyEmail = () => {
    navigator.clipboard.writeText('miiankhiizar@gmail.com');
    alert(t('Copied!'));
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const data = await importData(file);
      if (data) onImport(data);
    }
  };

  const activeCurrency = CURRENCIES.find(c => c.code === state.currency) || CURRENCIES[0];
  const activeLanguage = LANGUAGES.find(l => l.code === state.language) || LANGUAGES[0];

  return (
    <div className="p-6 space-y-8 animate-in slide-in-from-left-10 duration-500 pb-24">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('settings')}</h1>

      {/* Preferences Section */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 px-2">General</h3>
        <div className="bg-white dark:bg-[#1E293B] rounded-[2rem] border border-black/5 dark:border-white/5 divide-y divide-black/5 dark:divide-white/5 overflow-hidden shadow-sm">
          <button 
            onClick={() => onUpdateConfig({ theme: state.theme === 'dark' ? 'light' : 'dark' })}
            className="w-full p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${state.theme === 'dark' ? 'bg-amber-500/10 text-amber-500' : 'bg-indigo-500/10 text-indigo-500'}`}>
                {state.theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
              </div>
              <span className="font-bold text-slate-700 dark:text-slate-200">{t('theme')}</span>
            </div>
            <div className={`w-8 h-4 rounded-full relative transition-colors ${state.theme === 'dark' ? 'bg-sky-500' : 'bg-slate-200'}`}>
              <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${state.theme === 'dark' ? 'left-4.5' : 'left-0.5'}`} />
            </div>
          </button>

          <button onClick={() => setActivePopup('currency')} className="w-full p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500"><Coins size={20} /></div>
              <span className="font-bold text-slate-700 dark:text-slate-200">{t('currency')}</span>
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase">{activeCurrency.code}</span>
          </button>

          <button onClick={() => setActivePopup('language')} className="w-full p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-sky-500/10 rounded-xl flex items-center justify-center text-sky-500"><LangIcon size={20} /></div>
              <span className="font-bold text-slate-700 dark:text-slate-200">{t('language')}</span>
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase">{activeLanguage.code}</span>
          </button>

          <button onClick={() => onNav('analytics')} className="w-full p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500"><BarChart3 size={20} /></div>
              <span className="font-bold text-slate-700 dark:text-slate-200">{t('analytics')}</span>
            </div>
            <ChevronRight size={16} className="text-slate-300" />
          </button>
        </div>
      </div>

      {/* Data Management Section */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 px-2">Data Management</h3>
        <div className="bg-white dark:bg-[#1E293B] rounded-[2rem] border border-black/5 dark:border-white/5 divide-y divide-black/5 dark:divide-white/5 overflow-hidden shadow-sm">
          <button onClick={exportData} className="w-full p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-sky-500/10 rounded-xl flex items-center justify-center text-sky-500"><Download size={20} /></div>
              <span className="font-bold text-slate-700 dark:text-slate-200">{t('export')}</span>
            </div>
          </button>

          <button onClick={() => fileInputRef.current?.click()} className="w-full p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500"><Upload size={20} /></div>
              <span className="font-bold text-slate-700 dark:text-slate-200">{t('import')}</span>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleImport} className="hidden" accept=".json" />
          </button>

          <button 
            onClick={() => { if(window.confirm(t('reset_confirm'))) onReset(); }}
            className="w-full p-5 flex items-center justify-between hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500"><RefreshCw size={20} /></div>
              <span className="font-bold text-rose-600 dark:text-rose-400">{t('reset')}</span>
            </div>
          </button>
        </div>
      </div>

      {/* Developer Section */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-sky-900/40 dark:to-indigo-900/40 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10"><DollarSign size={80} /></div>
        <div className="relative z-10 space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Hostel Tracker</h2>
            <p className="text-xs text-sky-400 font-bold uppercase tracking-widest">{t('version')} 1.5.0</p>
          </div>
          <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10">
            <a href="https://www.linkedin.com/in/mian-khizar-06aa6b390/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl hover:bg-white/20 transition-colors">
              <Linkedin size={18} />
              <span className="text-xs font-bold">LinkedIn</span>
            </a>
            <button onClick={copyEmail} className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl hover:bg-white/20 transition-colors">
              <Mail size={18} />
              <span className="text-xs font-bold">Email Support</span>
            </button>
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold">
            <span className="text-slate-400">DEVELOPER</span>
            <span className="text-sky-400 tracking-wider">MIAN KHIZAR</span>
          </div>
        </div>
      </div>

      <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.4em] pt-4">Secure • Offline • Free</p>

      {/* Popups */}
      {activePopup === 'currency' && (
        <Modal title={t('Select Currency')} onClose={() => setActivePopup(null)}>
          {CURRENCIES.map(curr => (
            <button key={curr.code} onClick={() => { onUpdateConfig({ currency: curr.code }); setActivePopup(null); }} className={`p-5 rounded-2xl flex items-center justify-between transition-all ${state.currency === curr.code ? 'bg-sky-500 text-white' : 'bg-slate-50 dark:bg-slate-800/50'}`}>
              <div className="flex items-center gap-4"><span className="font-bold">{curr.symbol}</span><span>{curr.code}</span></div>
              {state.currency === curr.code && <ChevronRight size={16} />}
            </button>
          ))}
        </Modal>
      )}

      {activePopup === 'language' && (
        <Modal title={t('Select Language')} onClose={() => setActivePopup(null)}>
          <div className="grid grid-cols-2 gap-3">
            {LANGUAGES.map(lang => (
              <button key={lang.code} onClick={() => { onUpdateConfig({ language: lang.code }); setActivePopup(null); }} className={`p-4 rounded-2xl flex flex-col items-center border-2 ${state.language === lang.code ? 'bg-sky-500 border-sky-400 text-white' : 'bg-slate-50 dark:bg-slate-800/50 border-transparent text-slate-500'}`}>
                <span className="text-lg font-bold">{lang.native}</span>
              </button>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Settings;
