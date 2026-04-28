import React, { useMemo, useState, useEffect } from 'react';
import { 
  RadialBarChart, 
  RadialBar, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { Smartphone, Zap, Activity, Clock, AlertCircle } from 'lucide-react';
import { DataCard } from '../components/DataCard';
import { getData } from '../services/storage';
import { StorageKeys, AlertConfig } from '../types';
import { getNativeAppUsage, NativeAppData } from '../services/native';
import { useLanguage } from '../services/i18n';

export const Dashboard: React.FC = () => {
  const [apps, setApps] = useState<NativeAppData[]>([]);
  const [isNativeAvailable, setIsNativeAvailable] = useState(true);
  const { t } = useLanguage();
  
  const alertConfig = getData<AlertConfig>(StorageKeys.ALERTS, { dailyLimit: 2048, alertPercentage: 80 });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getNativeAppUsage();
        setApps(data);
        setIsNativeAvailable(true);
      } catch (e) {
        setIsNativeAvailable(false);
      }
    };
    loadStats();
  }, []);

  const totalUsed = useMemo(() => apps.reduce((sum, app) => sum + app.dataUsed, 0), [apps]);
  const limit = alertConfig.dailyLimit;
  const percentage = Math.min(Math.round((totalUsed / limit) * 100), 100);
  const remaining = Math.max(limit - totalUsed, 0);

  const chartData = [
    { name: 'Used', value: totalUsed, fill: '#3b82f6' },
  ];

  const topApp = useMemo(() => {
    if (apps.length === 0) return null;
    return [...apps].sort((a, b) => b.dataUsed - a.dataUsed)[0];
  }, [apps]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{t('DataGuard Lite')}</h2>
          <p className="text-slate-500 dark:text-slate-400">{t('Keep your bandwidth in check, effortlessly.')}</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => window.location.hash = '#/alerts'} 
            className="flex items-center space-x-2 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <span className="text-sm font-medium text-primary-500">{t('Edit Limit')}</span>
          </button>
          <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
            <Clock size={16} className="text-primary-500" />
            <span className="text-sm font-medium dark:text-slate-300">{t('Updated just now')}</span>
          </div>
        </div>
      </div>

      {!isNativeAvailable && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-xl flex items-start space-x-3">
          <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="text-amber-800 dark:text-amber-400 font-bold text-sm">{t('Preview Mode')}</h4>
            <p className="text-amber-700 dark:text-amber-500 text-xs mt-1">
              {t('Automatic data tracking requires the Android native bridge. Stats below are currently showing zero. Please package as an APK to view real usage.')}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Card */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Activity size={120} />
          </div>
          
          <h3 className="text-lg font-bold mb-8 self-start text-slate-900 dark:text-white">{t('Daily Usage Overview')}</h3>
          
          <div className="h-[250px] w-full max-w-[300px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart 
                cx="50%" 
                cy="50%" 
                innerRadius="70%" 
                outerRadius="100%" 
                barSize={20} 
                data={chartData}
                startAngle={180}
                endAngle={-180}
              >
                <RadialBar
                  background
                  dataKey="value"
                  cornerRadius={10}
                >
                  <Cell fill="#3b82f6" />
                </RadialBar>
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-bold text-slate-900 dark:text-white">{percentage}%</span>
              <span className="text-sm text-slate-500">{t('of daily limit')}</span>
            </div>
          </div>

          <p className="mt-4 text-slate-600 dark:text-slate-400 text-center font-medium">
            {t('You\'ve used')} <span className="text-primary-500 font-bold">{totalUsed.toFixed(1)} MB</span> {t('of')} <span className="font-bold">{limit} MB</span> {t('today.')}
          </p>
        </div>

        {/* Quick Stats Column */}
        <div className="space-y-6">
          <DataCard 
            title={t('Remaining Data')} 
            value={`${remaining.toFixed(1)} MB`} 
            subtitle={t('available')}
            icon={<Zap size={20} />}
          />
          <DataCard 
            title={t('Weekly Total')} 
            value={`${(totalUsed * 6.2).toFixed(1)} MB`} 
            subtitle={t('estimated')}
            icon={<Activity size={20} />}
            trend={{ value: '12%', isUp: false }}
          />
          <DataCard 
            title={t('Top Consumer')} 
            value={topApp ? topApp.name : t('No data')} 
            subtitle={topApp ? `${topApp.dataUsed.toFixed(1)} MB` : ''}
            icon={<Smartphone size={20} />}
          />
        </div>
      </div>
    </div>
  );
};
