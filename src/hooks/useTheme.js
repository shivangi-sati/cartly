import { useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'cartly-theme'

function getInitialTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    // localStorage can be unavailable in private browsing — fall back to the OS setting.
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme)
  const userChoseRef = useRef(false)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.style.colorScheme = theme

    // Persist only an explicit choice, so the OS setting keeps working until then.
    if (userChoseRef.current) {
      try {
        localStorage.setItem(STORAGE_KEY, theme)
      } catch {
        // Ignore storage failures; the toggle still works for this session.
      }
    }
  }, [theme])

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) return
    } catch {
      // Keep following the OS if storage is unavailable.
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const followSystem = (event) => setTheme(event.matches ? 'dark' : 'light')
    media.addEventListener('change', followSystem)
    return () => media.removeEventListener('change', followSystem)
  }, [])

  const toggleTheme = () => {
    userChoseRef.current = true
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }

  return { theme, toggleTheme }
}
