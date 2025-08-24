import React, { useState, useEffect } from 'react';
import { ThemeContext } from './ThemeTypeContext';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // const [isDarkMode, setIsDarkMode] = useState(false);
    const [gradientColors, setGradientColors] = useState<[string, string]>(['#F3F3F3', '#C5D3ED']);

    // Update gradient colors when theme changes
    useEffect(() => {
        setGradientColors(['#F3F3F3', '#C5D3ED']);
    }, []);

    return (
        <ThemeContext.Provider value={{ gradientColors }}>
            {children}
        </ThemeContext.Provider>
    );
};
