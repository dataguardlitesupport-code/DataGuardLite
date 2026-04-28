import React, { useState, useEffect } from 'react';
import { Bell, Save, CheckCircle2 } from 'lucide-react';
import { getData, saveData } from '../services/storage';
import { StorageKeys, AlertConfig } from '../types';
import { useLanguage } from '../services/i18n';

export const Alerts: React.FC = () => {
  const [config, setConfig] = useState<AlertConfig>({ dailyLimit: 2048, alertPercentage: 80 });
  const [showSuccess, setShowSuccess] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    setConfig(getData<AlertConfig>(StorageKeys.ALERTS, { dailyLimit: 2048, alertPercentage: 80 }));
  }, []);

  const handleSave = () => {
    saveData(StorageKeys.ALERTS, config);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Bell size={32} />
        </div>
        <h2 className="text-2xl font-bold dark:text-white">{t('Smart Alerts')}</h2>
        <p className="text-slate-500 dark:text-slate-400">{t('Get notified before you run out of data.')}</p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-8">
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{t('Daily Data Limit (MB)')}</span>
            <input 
              type="number" 
              value={config.dailyLimit}
              onChange={(e) => setConfig({ ...config, dailyLimit: parseInt(e.target.value) || 0 })}
              className="mt-2 w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-lg font-bold text-primary-500 outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            />
          </label>
          <p className="text-xs text-slate-400">{t('Standard plans are often 1GB (1024MB) or 2GB (2048MB).')}</p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{t('Alert Threshold (%)')}</span>
            <span className="text-lg font-bold text-primary-500">{config.alertPercentage}%</span>
          </div>
          <input 
            type="range" 
            min="50" 
            max="100" 
            step="5"
            value={config.alertPercentage}
            onChange={(e) => setConfig({ ...config, alertPercentage: parseInt(e.target.value) })}
            className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary-500"
          />
          <div className="flex justify-between text-xs text-slate-400">
            <span>{t('50% (Conservative)')}</span>
            <span>{t('100% (Critical)')}</span>
          </div>
        </div>

        <button 
          onClick={handleSave}
          className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 flex items-center justify-center space-x-2 transition-all active:scale-95"
        >
          <Save size={20} />
          <span>{t('Save Configuration')}</span>
        </button>

        {showSuccess && (
          <div className="flex items-center justify-center space-x-2 text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
            <CheckCircle2 size={18} />
            <span className="text-sm font-bold">{t('Settings saved successfully!')}</span>
          </div>
        )}
      </div>
    </div>
  );
};
