import React from 'react';
import { FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Terms: React.FC = () => {
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
          <FileText size={32} />
        </div>
        <h2 className="text-3xl font-bold dark:text-white">Terms of Service</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Please read these terms carefully.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-6 text-slate-700 dark:text-slate-300">
        <section>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">1. Acceptance of Terms</h3>
          <p>By using DataGuard Lite, you agree to these terms. This app is provided "as is" without warranty of any kind, either express or implied, including but not limited to the implied warranties of merchantability and fitness for a particular purpose.</p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">2. Usage Capabilities</h3>
          <p>DataGuard Lite uses Android Accessibility and Usage Access services strictly for estimating data consumption. We do not guarantee 100% accuracy of the data reported, as native OS calculations may slightly differ. Use the system settings for exact billing information.</p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">3. Intellectual Property</h3>
          <p>All content, features, and functionality of DataGuard Lite are owned by the developer and are protected by international copyright laws.</p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">4. Limitations of Liability</h3>
          <p>The developer shall not be held liable for any damages, battery drain, or data overage fees resulting from your use of the application.</p>
        </section>

        <p className="text-sm text-slate-500 pt-4 border-t border-slate-100 dark:border-slate-800">
          Last updated: November 2023
        </p>
      </div>
    </div>
  );
};
