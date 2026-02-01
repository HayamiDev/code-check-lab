import { useState, useEffect } from 'react'

const THEME_KEY = 'theme-preference'

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(THEME_KEY) || 'system'
    }
    return 'system'
  })

  useEffect(() => {
    const root = document.documentElement

    const applyTheme = (themeValue) => {
      // まずdarkクラスを削除してからリセット
      root.classList.remove('dark')

      if (themeValue === 'dark') {
        root.classList.add('dark')
      } else if (themeValue === 'light') {
        // darkクラスは既に削除済み
      } else {
        // system
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        if (prefersDark) {
          root.classList.add('dark')
        }
      }
    }

    applyTheme(theme)
    localStorage.setItem(THEME_KEY, theme)

    // システム設定の変更を監視
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  return [theme, setTheme]
}
