import { SunMoon, MoonStar } from 'lucide-react';
import { useTheme } from "../../lib/contexts/ThemeTypeContext";
import { useCallback } from 'react';

const ThemeToggle = () => {
    // State to track current theme
    const {isDarkMode, toggleTheme} = useTheme();

    const handleToggle = useCallback(() => {
        toggleTheme();
        }, [toggleTheme]
    )

    return (
        <button
            onClick={handleToggle}
            style={{borderRadius: 40, height: 40, width: 40, justifyItems: "center", flex: 1}}
        >
            {isDarkMode ? (
                <MoonStar size={24} color="#fff" />
            ) : (
                <SunMoon size={24} color="#000" />
            )}
        </button>
    );
};

export default ThemeToggle;