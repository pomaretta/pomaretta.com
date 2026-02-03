'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { translations, type Locale, type TranslationKeys } from './translations'

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: typeof translations.en | typeof translations.es
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')

  // Load saved locale from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('locale') as Locale
    if (saved && (saved === 'en' || saved === 'es')) {
      setLocaleState(saved)
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('locale', newLocale)
  }

  const value: LanguageContextType = {
    locale,
    setLocale,
    t: translations[locale],
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
