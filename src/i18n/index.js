import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import hi from "./locales/hi.json";

const STORAGE_KEY = "lang";
const DEFAULT_LANG = "hi";

const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
    },
    lng: saved || DEFAULT_LANG,
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    returnNull: false,
  });

export const setLanguage = (lng) => {
  i18n.changeLanguage(lng);
  localStorage.setItem(STORAGE_KEY, lng);
  document.documentElement.lang = lng;
};

if (typeof document !== "undefined") {
  document.documentElement.lang = saved || DEFAULT_LANG;
}

export default i18n;
