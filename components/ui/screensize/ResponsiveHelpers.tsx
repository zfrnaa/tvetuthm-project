import { Dimensions, Platform } from "react-native";
import {
  DIMENSION_MODES,
  SMALL_SCREEN_WIDTH,
  TABLET_SCREEN_WIDTH,
} from "./ResponsiveConstants";

export const isWeb: boolean = Platform.OS === 'web';

// Get the device width and height using Dimensions
const { width: deviceWidth, height: deviceHeight } = Dimensions.get("window");

// Check if the device is in landscape mode
export const isLandscapeDevice = deviceWidth >= deviceHeight;

// Determine the dimension mode of the screen based on window dimensions
export const getDimensionModeOfScreen = (window) => {
  if (!window || !window.width || !window.height) {
    // If window dimensions are not available, assume large screen mode
    return DIMENSION_MODES.IS_MOBILE_MODE;
  }
  const { width: screenWidth, height: screenHeight } = window;
  if (screenWidth >= TABLET_SCREEN_WIDTH && screenWidth > screenHeight) {
    return DIMENSION_MODES.IS_LANDSCAPE_MODE;
  }
  if (
    screenWidth >= SMALL_SCREEN_WIDTH &&
    screenWidth < TABLET_SCREEN_WIDTH &&
    screenWidth < screenHeight
  ) {
    return DIMENSION_MODES.IS_TABLET_PORTRAIT_MODE;
  }
  if (screenWidth < SMALL_SCREEN_WIDTH && screenWidth < screenHeight) {
    return DIMENSION_MODES.IS_MOBILE_MODE;
  }

  // Default to large screen mode if no conditions are met
  return DIMENSION_MODES.IS_MOBILE_MODE;
};

export const isLandscapeMode = (currentViewMode) => {
  if (!isWeb) {
    return isLandscapeDevice;
  }
  return currentViewMode === DIMENSION_MODES.IS_LANDSCAPE_MODE || false;
};