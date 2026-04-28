export interface AppData {
  id: string;
  name: string;
  dataUsed: number; // in MB
}

export interface AlertConfig {
  dailyLimit: number;
  alertPercentage: number;
}

export interface Tip {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export enum StorageKeys {
  APPS = 'dg_apps',
  ALERTS = 'dg_alerts',
  THEME = 'dg_theme',
  LANG = 'dg_lang'
}
