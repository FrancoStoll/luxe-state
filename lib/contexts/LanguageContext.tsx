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
    if (savedLang && ['es', 'en', 'pt-br'].includes(savedLang)) {
      setLanguageState(savedLang);
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'en') setLanguageState('en');
      else if (browserLang === 'pt') setLanguageState('pt-br');
      else setLanguageState('es'); // Default
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    Cookies.set('user-language', lang, { expires: 365 });
  };

  const t = (key: string) => {
    const keys = key.split('.');
    let current: Record<string, any> = translations[language];
    
    for (const k of keys) {
      if (current[k] === undefined) return key;
      current = current[k];
    }
    
    return current as unknown as string;
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
