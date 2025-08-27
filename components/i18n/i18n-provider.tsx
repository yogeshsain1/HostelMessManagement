'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import '../lib/i18n'

interface I18nProviderProps {
  children: React.ReactNode
}

export default function I18nProvider({ children }: I18nProviderProps) {
  const { i18n } = useTranslation()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Load user language preference from localStorage or API
    const loadLanguagePreference = async () => {
      try {
        // Try to get language from user preferences API
        const response = await fetch('/api/preferences')
        if (response.ok) {
          const preferences = await response.json()
          if (preferences.language && preferences.language !== i18n.language) {
            i18n.changeLanguage(preferences.language)
          }
        }
      } catch (error) {
        console.error('Error loading language preference:', error)
        // Fallback to browser language or default
        const browserLang = navigator.language.split('-')[0]
        if (['en', 'hi'].includes(browserLang) && browserLang !== i18n.language) {
          i18n.changeLanguage(browserLang)
        }
      }
    }

    loadLanguagePreference()
  }, [i18n])

  return <>{children}</>
}
