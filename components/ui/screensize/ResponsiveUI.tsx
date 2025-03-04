import { Dimensions } from "react-native";
import { useEffect, useState } from "react";
import { isWeb } from "../utils/AppHelper";
import { getDimensionModeOfScreen } from "./ResponsiveHelpers";

const deviceWindow = Dimensions.get("window");
const initialMode = getDimensionModeOfScreen(deviceWindow);

export function useScreenModes() {
  const [currentViewMode, setCurrentViewMode] = useState(initialMode);

  useEffect(() => {
    let deviceEventListener = null;
    if (isWeb) {
      deviceEventListener = Dimensions.addEventListener(
        "change",
        handleOrientationChange
      );
    }
    return () => {
      if (deviceEventListener && isWeb) {
        deviceEventListener.remove();
      }
    };
  }, []);

  const handleOrientationChange = (data) => {
    if (data?.window) {
      const mode = getDimensionModeOfScreen(data.window);
      if (mode) {
        setCurrentViewMode(mode);
      }
    }
  };

  return currentViewMode;
}