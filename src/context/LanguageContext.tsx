import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Language = 'en' | 'vi';

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
};

const LANGUAGE_KEY = 'portfolio-language';
const LanguageContext = createContext<LanguageContextValue>({ language: 'en', setLanguage: () => undefined });

function getInitialLanguage(): Language {
  try {
    return window.localStorage.getItem(LANGUAGE_KEY) === 'vi' ? 'vi' : 'en';
  } catch {
    return 'en';
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
    try {
      window.localStorage.setItem(LANGUAGE_KEY, language);
    } catch {
      // The preference remains available for the current page when storage is disabled.
    }
  }, [language]);

  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext);
}
