import { createContext, useContext, useState, useCallback } from 'react'
import translations from '../data/translations'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('eg_lang') || 'en')

  const changeLang = useCallback((newLang) => {
    setLang(newLang)
    localStorage.setItem('eg_lang', newLang)
  }, [])

  const t = useCallback((key) => {
    const dict = translations[lang] || translations.en
    return dict[key] || translations.en[key] || key
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
