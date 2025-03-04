// import { Stack } from "expo-router";

// export default function Layout() {
//   return <Stack screenOptions={{ headerShown: false }} />;
// }

import { Slot } from "expo-router";
import { I18nextProvider } from "react-i18next";
import i18n from "@/locales/i18n"; // Import your i18n setup

export default function Layout() {
  return (
    <I18nextProvider i18n={i18n}>
      <Slot />
    </I18nextProvider>
  );
}
