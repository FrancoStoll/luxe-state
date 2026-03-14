import { cookies } from 'next/headers';
import es from '@/i18n/es.json';
import en from '@/i18n/en.json';
import ptBr from '@/i18n/pt-br.json';

const translations: Record<string, any> = {
  es,
  en,
  'pt-br': ptBr,
};

export async function getTranslation() {
  const cookieStore = await cookies();
  const lang = cookieStore.get('user-language')?.value || 'es';
  const dictionary = translations[lang] || translations.es;

  return {
    t: (key: string) => {
      const keys = key.split('.');
      let current = dictionary;
      
      for (const k of keys) {
        if (current[k] === undefined) return key;
        current = current[k];
      }
      
      return current as string;
    },
    lang
  };
}
