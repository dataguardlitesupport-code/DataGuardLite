import React from 'react';

interface DataCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isUp: boolean;
  };
}

export const DataCard: React.FC<DataCardProps> = ({ title, value, subtitle, icon, trend }) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</h3>
        {icon && <div className="text-primary-500">{icon}</div>}
      </div>
      <div className="flex items-baseline space-x-2">
        <span className="text-2xl font-bold text-slate-900 dark:text-white">{value}</span>
        {subtitle && <span className="text-sm text-slate-400">{subtitle}</span>}
      </div>
      {trend && (
        <div className={`mt-2 text-xs font-medium flex items-center ${trend.isUp ? 'text-rose-500' : 'text-emerald-500'}`}>
          {trend.isUp ? '↑' : '↓'} {trend.value} from last week
        </div>
      )}
    </div>
  );
};
