'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import es from '@/i18n/es.json';
import en from '@/i18n/en.json';
import ptBr from '@/i18n/pt-br.json';

type Language = 'es' | 'en' | 'pt-br';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  es,
  en,
  'pt-br': ptBr,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('es');

  useEffect(() => {
    const savedLang = Cookies.get('user-language') as Language;
    let initialLang: Language = 'es';
    
    if (savedLang && ['es', 'en', 'pt-br'].includes(savedLang)) {
      initialLang = savedLang;
    } else {
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'en') initialLang = 'en';
      else if (browserLang === 'pt') initialLang = 'pt-br';
    }
    
    if (initialLang !== language) {
      setLanguageState(initialLang);
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    Cookies.set('user-language', lang, { expires: 365 });
  };

  const t = (key: string) => {
    const keys = key.split('.');
    let current: unknown = translations[language];
    
    for (const k of keys) {
      if (current === null || typeof current !== 'object' || (current as Record<string, unknown>)[k] === undefined) return key;
      current = (current as Record<string, unknown>)[k];
    }
    
    return typeof current === 'string' ? current : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
