import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type ThemePreference =
  | 'light'
  | 'dark'
  | 'system'

interface ThemeContextValue {
  theme: ThemePreference
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: ThemePreference) => void
}

const ThemeContext =
  createContext<ThemeContextValue | undefined>(
    undefined,
  )

const STORAGE_KEY = 'eyedrope-theme'

function getStoredTheme(): ThemePreference {
  if (typeof window === 'undefined') {
    return 'light'
  }

  const stored = window.localStorage.getItem(
    STORAGE_KEY,
  )

  if (
    stored === 'light' ||
    stored === 'dark' ||
    stored === 'system'
  ) {
    return stored
  }

  return 'system'
}

function getSystemTheme(): 'light' | 'dark' {
  if (
    typeof window !== 'undefined' &&
    window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches
  ) {
    return 'dark'
  }

  return 'light'
}

export function ThemeProvider({
  children,
}: {
  children: ReactNode
}) {
  const [theme, setThemeState] =
    useState<ThemePreference>(
      getStoredTheme,
    )

  const [systemTheme, setSystemTheme] =
    useState<'light' | 'dark'>(() =>
      getSystemTheme(),
    )

  const resolvedTheme =
    theme === 'system'
      ? systemTheme
      : theme

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      theme,
    )
  }, [theme])

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      '(prefers-color-scheme: dark)',
    )

    function handleChange() {
      setSystemTheme(
        mediaQuery.matches ? 'dark' : 'light',
      )
    }

    handleChange()

    mediaQuery.addEventListener(
      'change',
      handleChange,
    )

    return () => {
      mediaQuery.removeEventListener(
        'change',
        handleChange,
      )
    }
  }, [])

  useEffect(() => {
  const root = document.documentElement

  root.dataset.theme = resolvedTheme

  if (resolvedTheme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}, [resolvedTheme])

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme: (nextTheme: ThemePreference) => {
        setThemeState(nextTheme)
      },
    }),
    [theme, resolvedTheme],
  )

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error(
      'useTheme must be used inside ThemeProvider',
    )
  }

  return context
}