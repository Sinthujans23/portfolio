import { createContext, useContext } from 'react'

const theme = { theme: 'dark' }
const ThemeContext = createContext(theme)

export function ThemeProvider({ children }) {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
