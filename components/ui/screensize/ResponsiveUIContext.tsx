import React from "react";
import { DIMENSION_MODES } from "./ResponsiveConstants";

export const MyResponsiveContext = React.createContext(
  DIMENSION_MODES.IS_MOBILE_MODE
);