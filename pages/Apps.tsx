import React, { useState, useEffect } from 'react';
import { Search, Smartphone, AlertCircle, RefreshCw } from 'lucide-react';
import { getNativeAppUsage, NativeAppData } from '../services/native';
import { useLanguage } from '../services/i18n';

export const Apps: React.FC = () => {
  const [apps, setApps] = useState<NativeAppData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [nativeError, setNativeError] = useState<string | null>(null);
  const { t } = useLanguage();

  const loadApps = async () => {
    setIsLoading(true);
    setNativeError(null);
    try {
      const data = await getNativeAppUsage();
      // Sort by data used descending
      setApps(data.sort((a, b) => b.dataUsed - a.dataUsed));
    } catch (e: any) {
      if (e.message === 'NativeBridgeNotAvailable') {
        setNativeError('This feature requires the native Android application to access device system APIs. Please install the APK.');
      } else {
        setNativeError('Failed to read app data from the device.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApps();
  }, []);

  const filteredApps = apps.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    app.packageName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <h2 className="text-2xl font-bold dark:text-white">{t('Device Apps')}</h2>
          <button 
            onClick={loadApps}
            className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search apps..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoading || !!nativeError}
            className="pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all w-full sm:w-64 disabled:opacity-50"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <RefreshCw size={32} className="mx-auto text-primary-500 animate-spin mb-4" />
          <p className="text-slate-500">{t('Scanning device applications...')}</p>
        </div>
      ) : nativeError ? (
        <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-900/50 rounded-2xl p-8 text-center">
          <AlertCircle size={48} className="mx-auto text-rose-500 mb-4" />
          <h3 className="text-lg font-bold text-rose-700 dark:text-rose-400 mb-2">{t('Native Access Required')}</h3>
          <p className="text-rose-600 dark:text-rose-300 max-w-md mx-auto">{t(nativeError)}</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredApps.length > 0 ? (
            filteredApps.map(app => (
              <div key={app.id || app.packageName} className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-4">
                  {app.iconData ? (
                    <img src={`data:image/png;base64,${app.iconData}`} alt={app.name} className="w-12 h-12 rounded-xl object-contain bg-slate-50 dark:bg-slate-800 p-1" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-bold text-lg">
                      {app.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{app.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate max-w-[200px] sm:max-w-xs">{app.packageName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-slate-900 dark:text-white">{app.dataUsed.toFixed(1)}</div>
                  <div className="text-xs text-slate-500">MB</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
              <Smartphone size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500">No applications matched your search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
