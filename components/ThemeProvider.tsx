"use client"

import { useEffect, useState, ReactNode } from "react"

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Detect system theme preference
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    
    const updateTheme = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
    
    // Set initial theme
    updateTheme(mediaQuery)
    
    // Listen for changes
    mediaQuery.addEventListener("change", updateTheme)
    
    return () => {
      mediaQuery.removeEventListener("change", updateTheme)
    }
  }, [])

  if (!mounted) {
    // Default to dark during SSR
    return <>{children}</>
  }

  return <>{children}</>
}


