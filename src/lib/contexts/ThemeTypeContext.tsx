import { createContext, useContext } from 'react';

export type ThemeContextType = {
    // isDarkMode: boolean;
    // toggleTheme: () => void;
    gradientColors: [string, string];
};

// Create theme context
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Export the useTheme hook to avoid using useContext directly
export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};