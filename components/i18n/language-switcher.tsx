'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Globe } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
]

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [isChanging, setIsChanging] = useState(false)
  const { toast } = useToast()

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]

  const changeLanguage = async (languageCode: string) => {
    setIsChanging(true)
    try {
      await i18n.changeLanguage(languageCode)

      // Save language preference to backend
      await fetch('/api/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: languageCode,
        }),
      })

      toast({
        title: 'Language Changed',
        description: `Language changed to ${languages.find(l => l.code === languageCode)?.name}`,
      })
    } catch (error) {
      console.error('Error changing language:', error)
      toast({
        title: 'Error',
        description: 'Failed to change language',
        variant: 'destructive',
      })
    } finally {
      setIsChanging(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isChanging}>
          <Globe className="w-4 h-4 mr-2" />
          {currentLanguage.flag} {currentLanguage.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className={`cursor-pointer ${
              i18n.language === language.code ? 'bg-accent' : ''
            }`}
          >
            <span className="mr-2">{language.flag}</span>
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
