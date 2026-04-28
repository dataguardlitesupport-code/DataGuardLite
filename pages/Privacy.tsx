import React from 'react';
import { Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Privacy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center space-x-3 mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          ← Back
        </button>
      </div>

      <div className="text-center">
        <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield size={32} />
        </div>
        <h2 className="text-3xl font-bold dark:text-white">Privacy Policy</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Your data stays on your device.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-6 text-slate-700 dark:text-slate-300">
        <section>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">1. Data Collection</h3>
          <p>DataGuard Lite accesses device application usage information solely for the purpose of displaying it to you within this dashboard. We do not collect, transmit, or sell any of your personal data or usage metrics to external servers.</p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">2. Local Storage</h3>
          <p>Any settings, configurations, or limits you set within the application are stored locally on your device. Clearing the application data will remove these settings permanently.</p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">3. Third-Party Access</h3>
          <p>We do not use any third-party tracking, analytics, or advertising libraries that would have access to your app usage behavior or personal information.</p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">4. Contact</h3>
          <p>If you have any questions or privacy concerns, please contact us at <strong>dataguardlitesupport@gmail.com</strong>.</p>
        </section>

        <p className="text-sm text-slate-500 pt-4 border-t border-slate-100 dark:border-slate-800">
          Last updated: November 2023
        </p>
      </div>
    </div>
  );
};
