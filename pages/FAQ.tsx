import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../services/i18n';

const faqs = [
  {
    question: "How does DataGuard Lite track my data?",
    answer: "DataGuard Lite requests permission to access your device's usage statistics for installed applications. It reads the system's recorded network bytes transmitted and received by each application to provide you with insights."
  },
  {
    question: "Why do the numbers differ slightly from my carrier's app?",
    answer: "Your mobile carrier measures data usage at their network switches, while DataGuard measures it locally on your device. Background system processes, tethering, or data compression can cause slight discrepancies."
  },
  {
    question: "Does this app work entirely offline?",
    answer: "Yes! DataGuard Lite is designed to operate 100% offline. We do not transmit your usage statistics to any external servers. Everything is processed locally on your device."
  },
  {
    question: "How do I set a daily data limit?",
    answer: "Go to the Dashboard page, click the 'Edit Limit' button near your usage graph, and enter your desired daily limit in Megabytes (MB). Your progress will update automatically."
  },
  {
    question: "Why are some system apps not showing?",
    answer: "DataGuard focuses on user-installed applications that typically consume the most data. OS-level background processes might be grouped or hidden to reduce clutter."
  }
];

export const FAQ: React.FC = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { t } = useLanguage();

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center space-x-3 mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          ← {t('Back')}
        </button>
      </div>

      <div className="text-center">
        <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <HelpCircle size={32} />
        </div>
        <h2 className="text-3xl font-bold dark:text-white">{t('Help & FAQ')}</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">{t('Find answers to common questions about DataGuard Lite.')}</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index} 
              className={`bg-white dark:bg-slate-900 rounded-2xl shadow-sm border transition-all duration-300 overflow-hidden ${
                isOpen 
                  ? 'border-primary-500/50 ring-1 ring-primary-500/20' 
                  : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <button 
                onClick={() => toggleFaq(index)}
                className="w-full p-6 flex items-start gap-4 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white pr-4">{t(faq.question)}</h3>
                </div>
                <div className="shrink-0 pt-1 text-slate-400">
                  {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </button>

              <div 
                className={`transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-6 pt-0 text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50/50 dark:bg-slate-800/20 shadow-[inset_0_10px_10px_-10px_rgba(0,0,0,0.05)] border-t border-slate-100 dark:border-slate-800 mt-2">
                  <div className="pt-4">
                    {t(faq.answer)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-900/30 p-8 rounded-2xl text-center mt-12">
        <h3 className="text-lg font-bold text-primary-900 dark:text-primary-100 mb-2">{t('Still have questions?')}</h3>
        <p className="text-primary-700 dark:text-primary-300 mb-6 max-w-md mx-auto">
          {t('If you couldn\'t find the answer you were looking for, please don\'t hesitate to contact our support team.')}
        </p>
        <button 
          onClick={() => navigate('/contact')}
          className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-95"
        >
          {t('Contact Support')}
        </button>
      </div>
    </div>
  );
};
