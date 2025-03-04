import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import ms from "./ms.json";

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            ms: { translation: ms },
        },
        lng: "ms", // ✅ Default language set to Malay
        fallbackLng: "ms", // ✅ Fallback to Malay if translation is missing
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
