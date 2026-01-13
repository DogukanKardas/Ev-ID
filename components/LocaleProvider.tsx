"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { detectLocale, getLanguage, LocaleData, t as translate } from "@/lib/locale"

interface LocaleContextType {
  locale: LocaleData
  language: string
  t: (key: string) => string
  isInternational: boolean
  setLanguage: (lang: "tr" | "en") => void
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<LocaleData>({
    language: "tr",
    country: "TR",
    timezone: "Europe/Istanbul",
  })
  const [language, setLanguageState] = useState<"tr" | "en">("tr")

  useEffect(() => {
    let mounted = true
    
    async function loadLocale() {
      // Check localStorage first for manual language selection
      if (typeof window !== "undefined") {
        const savedLanguage = localStorage.getItem("preferred_language") as "tr" | "en" | null
        if (savedLanguage && (savedLanguage === "tr" || savedLanguage === "en")) {
          setLanguageState(savedLanguage)
          // Update locale based on saved language
          const detected = await detectLocale()
          
          if (!mounted) return
          
          setLocale({
            ...detected,
            language: savedLanguage,
          })
          
          // Track analytics (fire and forget, don't wait)
          try {
            const { supabase } = await import("@/lib/supabase")
            const { error } = await supabase.from("analytics").insert([
              {
                event_type: "locale_detected",
                metadata: {
                  locale: { ...detected, language: savedLanguage },
                  language: savedLanguage,
                  source: "localStorage",
                  timestamp: new Date().toISOString(),
                },
              },
            ])
            // Silently fail analytics - ignore errors
            if (error) {
              // Analytics errors are non-critical
            }
          } catch {
            // Silently fail
          }
          return
        }
      }

      // Auto-detect if no saved preference
      const detected = await detectLocale()
      
      if (!mounted) return
      
      setLocale(detected)
      const lang = getLanguage(detected) as "tr" | "en"
      setLanguageState(lang)
      
      // Track analytics (fire and forget)
      if (typeof window !== "undefined") {
        try {
          const { supabase } = await import("@/lib/supabase")
          const { error } = await supabase.from("analytics").insert([
            {
              event_type: "locale_detected",
              metadata: {
                locale: detected,
                language: lang,
                source: "auto-detect",
                timestamp: new Date().toISOString(),
              },
            },
          ])
          // Silently fail analytics - ignore errors
          if (error) {
            // Analytics errors are non-critical
          }
        } catch {
          // Silently fail
        }
      }
    }
    
    loadLocale()
    
    return () => {
      mounted = false
    }
  }, [])

  const setLanguage = async (lang: "tr" | "en") => {
    setLanguageState(lang)
    if (typeof window !== "undefined") {
      localStorage.setItem("preferred_language", lang)
      // Update locale
      setLocale((prev) => ({ ...prev, language: lang }))
      
      // Track analytics (fire and forget)
      try {
        const { supabase } = await import("@/lib/supabase")
        const { error } = await supabase.from("analytics").insert([
          {
            event_type: "language_changed",
            metadata: {
              language: lang,
              timestamp: new Date().toISOString(),
            },
          },
        ])
        // Silently fail analytics - ignore errors
        if (error) {
          // Analytics errors are non-critical
        }
      } catch {
        // Silently fail
      }
    }
  }

  const isInternational = locale.country !== "TR"

  return (
    <LocaleContext.Provider
      value={{
        locale,
        language,
        t: (key: string) => translate(key, language),
        isInternational,
        setLanguage,
      }}
    >
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (context === undefined) {
    throw new Error("useLocale must be used within a LocaleProvider")
  }
  return context
}


