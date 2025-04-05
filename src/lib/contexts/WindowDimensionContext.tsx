import { debounce } from "lodash";
import { useState, useEffect } from "react";
import { WindowDimensionsContext } from "./useWindowDimensionsContext";

export const WindowDimensionsProvider = ({ children }: { children: React.ReactNode }) => {
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth < 360,
        isTablet: window.innerWidth >= 768 && window.innerWidth < 1366,
        isDesktop: window.innerWidth >= 1366,
    });

    useEffect(() => {
        const handleResize = debounce(() => {
            setDimensions((prev) => {
                const newDimensions = {
                    width: window.innerWidth,
                    height: window.innerHeight,
                    isMobile: window.innerWidth < 768,
                    isTablet: window.innerWidth >= 768 && window.innerWidth < 1366,
                    isDesktop: window.innerWidth >= 1366,
                };

                return JSON.stringify(prev) !== JSON.stringify(newDimensions) ? newDimensions : prev;
            });
        }, 200);

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <WindowDimensionsContext.Provider value={dimensions}>
            {children}
        </WindowDimensionsContext.Provider>
    );
};