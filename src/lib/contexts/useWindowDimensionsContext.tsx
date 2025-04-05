import { useContext } from "react";
import { createContext } from "react";

export const WindowDimensionsContext = createContext({
    width: 0,
    height: 0,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
});

export const useWindowDimensionsContext = () => useContext(WindowDimensionsContext);
