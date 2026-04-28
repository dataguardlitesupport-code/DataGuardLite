import React, { useState, useEffect } from 'react';
import { Moon, Sun, RotateCcw, ShieldAlert, Trash2, Mail, Shield, FileText, ChevronRight, HelpCircle, Globe } from 'lucide-react';
import { getData, saveData, clearData } from '../services/storage';
import { StorageKeys } from '../types';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../services/i18n';

export const Settings: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const navigate = useNavigate();
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    const savedTheme = getData<string>(StorageKeys.THEME, 'light');
    setIsDarkMode(savedTheme === 'dark');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      saveData(StorageKeys.THEME, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      saveData(StorageKeys.THEME, 'light');
    }
  };

  const handleReset = () => {
    clearData();
    window.location.reload();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold dark:text-white">{t('Appearance')}</h3>
          <p className="text-sm text-slate-500">Customize how DataGuard looks on your device.</p>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400">
                {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{t('Dark Mode')}</p>
                <p className="text-xs text-slate-500">Switch between light and dark themes</p>
              </div>
            </div>
            <button 
              onClick={toggleDarkMode}
              className={`w-12 h-6 rounded-full transition-colors relative ${isDarkMode ? 'bg-primary-500' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${isDarkMode ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>
          
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400">
                <Globe size={20} />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{t('Language')}</p>
                <p className="text-xs text-slate-500">Choose your preferred language</p>
              </div>
            </div>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as 'en' | 'sw')}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 outline-none font-medium"
            >
              <option value="en">English</option>
              <option value="sw">Kiswahili</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold dark:text-white">{t('Support & Legal')}</h3>
          <p className="text-sm text-slate-500">Get help and view our legal policies.</p>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          <button 
            onClick={() => navigate('/faq')}
            className="w-full p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-500">
                <HelpCircle size={20} />
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-900 dark:text-white">{t('Help & FAQ')}</p>
                <p className="text-xs text-slate-500">Frequently asked questions</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-slate-400" />
          </button>

          <button 
            onClick={() => navigate('/contact')}
            className="w-full p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-primary-500">
                <Mail size={20} />
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-900 dark:text-white">{t('Contact Developer')}</p>
                <p className="text-xs text-slate-500">dataguardlitesupport@gmail.com</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-slate-400" />
          </button>
          
          <button 
            onClick={() => navigate('/privacy')}
            className="w-full p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400">
                <Shield size={20} />
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-900 dark:text-white">{t('Privacy Policy')}</p>
                <p className="text-xs text-slate-500">How we handle your data</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-slate-400" />
          </button>

          <button 
            onClick={() => navigate('/terms')}
            className="w-full p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400">
                <FileText size={20} />
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-900 dark:text-white">{t('Terms of Service')}</p>
                <p className="text-xs text-slate-500">Rules and guidelines</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-slate-400" />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold text-rose-500">{t('Danger Zone')}</h3>
          <p className="text-sm text-slate-500">Actions that cannot be undone.</p>
        </div>
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-rose-50 dark:bg-rose-900/20 rounded-lg text-rose-500">
                <RotateCcw size={20} />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Reset All Data</p>
                <p className="text-xs text-slate-500">Wipe all app tracking and alert settings</p>
              </div>
            </div>
            <button 
              onClick={() => setShowResetConfirm(true)}
              className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-rose-500/20"
            >
              Reset Data
            </button>
          </div>
        </div>
      </div>

      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-2xl p-6 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldAlert size={32} />
              </div>
              <h3 className="text-xl font-bold dark:text-white">Are you absolutely sure?</h3>
              <p className="text-slate-500 mt-2">This will permanently delete all your tracking history and configuration settings.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setShowResetConfirm(false)}
                className="py-3 px-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleReset}
                className="py-3 px-4 bg-rose-500 text-white font-bold rounded-xl hover:bg-rose-600 transition-colors flex items-center justify-center space-x-2"
              >
                <Trash2 size={18} />
                <span>Yes, Reset</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="text-center pt-8">
        <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">DataGuard Lite v1.0.4</p>
        <p className="text-slate-400 text-xs mt-1">Made with ❤️ for efficient browsing</p>
      </div>
    </div>
  );
};
