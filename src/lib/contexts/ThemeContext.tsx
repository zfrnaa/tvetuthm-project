import React, { useState, useEffect } from 'react';
import { ThemeContext } from './ThemeTypeContext';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [gradientColors, setGradientColors] = useState<[string, string]>(['#F3F3F3', '#C5D3ED']);

    // Update gradient colors when theme changes
    useEffect(() => {
        setGradientColors(isDarkMode ? ['#192328', '#242731'] : ['#F3F3F3', '#C5D3ED']);
    }, [isDarkMode]);

    useEffect(() => {
        // Check if theme preference exists in localStorage
        const storedTheme = localStorage.getItem('theme');
        const initialIsDark = storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);

        setIsDarkMode(initialIsDark);

        // Apply initial theme
        document.documentElement.classList.toggle('dark', initialIsDark);
        document.documentElement.style.colorScheme = initialIsDark ? 'dark' : 'light';
    }, []);

    const toggleTheme = () => {
        setIsDarkMode((prevMode) => {
            const newMode = !prevMode;
            document.documentElement.classList.toggle('dark', newMode);
            document.documentElement.style.colorScheme = newMode ? 'dark' : 'light';
            localStorage.setItem('theme', newMode ? 'dark' : 'light');
            return newMode;
        });
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme, gradientColors }}>
            {children}
        </ThemeContext.Provider>
    );
};
