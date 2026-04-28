import React, { createContext, useContext, useState, useEffect } from 'react';
import { getData, saveData } from './storage';
import { StorageKeys } from '../types';

type Language = 'en' | 'sw';

interface TranslationMap {
  [key: string]: {
    en: string;
    sw: string;
  };
}

const translations: TranslationMap = {
  'Dashboard': { en: 'Dashboard', sw: 'Dashibodi' },
  'Apps': { en: 'Apps', sw: 'Programu' },
  'Alerts': { en: 'Alerts', sw: 'Arifa' },
  'Tips': { en: 'Tips', sw: 'Vidokezo' },
  'Settings': { en: 'Settings', sw: 'Mipangilio' },
  'Appearance': { en: 'Appearance', sw: 'Mwonekano' },
  'Dark Mode': { en: 'Dark Mode', sw: 'Hali ya Giza' },
  'Language': { en: 'Language', sw: 'Lugha' },
  'Support & Legal': { en: 'Support & Legal', sw: 'Usaidizi na Kisheria' },
  'Contact Developer': { en: 'Contact Developer', sw: 'Wasiliana na Msanidi' },
  'Privacy Policy': { en: 'Privacy Policy', sw: 'Sera ya Faragha' },
  'Terms of Service': { en: 'Terms of Service', sw: 'Masharti ya Huduma' },
  'Help & FAQ': { en: 'Help & FAQ', sw: 'Msaada na Maswali' },
  'Danger Zone': { en: 'Danger Zone', sw: 'Eneo la Hatari' },
  'Reset All Data': { en: 'Reset All Data', sw: 'Futa Data Yote' },
  'Confirm Reset': { en: 'Confirm Reset', sw: 'Thibitisha Kufuta' }
};

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>('en');

  useEffect(() => {
    const savedLang = getData<Language>(StorageKeys.LANG, 'en');
    setLangState(savedLang);
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    saveData(StorageKeys.LANG, newLang);
  };

  const t = (key: string) => {
    if (translations[key] && translations[key][lang]) {
      return translations[key][lang];
    }
    return key; // fallback to key
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
