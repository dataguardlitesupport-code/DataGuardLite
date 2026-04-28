import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Smartphone, 
  BellRing, 
  Lightbulb, 
  Settings, 
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '../services/i18n';

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
}

const BottomNavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center w-full h-full space-y-1 ${
          isActive
            ? 'text-primary-500'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div className={`${isActive ? 'bg-primary-100 dark:bg-primary-900/40 p-1.5 rounded-full' : 'p-1.5'}`}>
            <Icon size={22} className={isActive ? 'fill-primary-500/20' : ''} />
          </div>
          <span className="text-[10px] font-medium">{label}</span>
        </>
      )}
    </NavLink>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { t } = useLanguage();

  const getPageTitle = () => {
    const path = location.pathname.substring(1) || 'dashboard';
    const translatedPath = t(path.charAt(0).toUpperCase() + path.slice(1));
    return translatedPath;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      {/* Topbar */}
      <header className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-30 px-6 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 safe-area-pt">
        <div className="flex items-center space-x-3">
          <div className="bg-primary-500 p-1.5 rounded-lg text-white">
            <ShieldCheck size={20} />
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            {getPageTitle()}
          </h1>
        </div>
        <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <img src="https://picsum.photos/seed/user/100/100" alt="Avatar" />
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto pb-24 relative">
        <div className="p-6 max-w-5xl mx-auto">
          {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-40 safe-area-pb">
        <div className="flex items-center justify-around h-16 px-2 max-w-md mx-auto">
          <BottomNavItem to="/" icon={LayoutDashboard} label={t('Dashboard')} />
          <BottomNavItem to="/apps" icon={Smartphone} label={t('Apps')} />
          <BottomNavItem to="/alerts" icon={BellRing} label={t('Alerts')} />
          <BottomNavItem to="/tips" icon={Lightbulb} label={t('Tips')} />
          <BottomNavItem to="/settings" icon={Settings} label={t('Settings')} />
        </div>
      </nav>
    </div>
  );
};
