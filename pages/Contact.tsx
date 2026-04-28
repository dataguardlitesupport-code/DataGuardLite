import React, { useState } from 'react';
import { Mail, Send, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../services/i18n';

export const Contact: React.FC = () => {
  const navigate = useNavigate();
  const [reason, setReason] = useState('bug');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;

    // In a real app with backend, we would send this data via API.
    // Here we'll use a mailto link as requested.
    const subject = encodeURIComponent(`DataGuard Lite - ${reason === 'bug' ? 'Bug Report' : reason === 'feature' ? 'Feature Request' : 'General Inquiry'}`);
    const body = encodeURIComponent(`Reason: ${reason}\n\nMessage:\n${message}\n\nApp Version: 1.0.0`);
    
    window.location.href = `mailto:dataguardlitesupport@gmail.com?subject=${subject}&body=${body}`;
    
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setMessage('');
      navigate(-1);
    }, 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
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
          <Mail size={32} />
        </div>
        <h2 className="text-3xl font-bold dark:text-white">{t('Contact Us')}</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">{t('We\'d love to hear from you. Send us a message.')}</p>
      </div>

      {submitted ? (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-8 text-center animate-in zoom-in-95">
          <CheckCircle className="mx-auto text-emerald-500 mb-4" size={48} />
          <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-400 mb-2">{t('Message Sent!')}</h3>
          <p className="text-emerald-600 dark:text-emerald-300">{t('Your email client has been opened. Thank you for contacting us!')}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              {t('Reason for Contact')}
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium appearance-none"
            >
              <option value="bug">{t('Report a Bug')}</option>
              <option value="feature">{t('Request a Feature')}</option>
              <option value="general">{t('General Inquiry')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              {t('Message')}
            </label>
            <textarea
              required
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('Tell us more about it...')}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 transition-all flex items-center justify-center space-x-2 active:scale-95"
          >
            <span>{t('Send Message')}</span>
            <Send size={18} />
          </button>
        </form>
      )}
    </div>
  );
};
