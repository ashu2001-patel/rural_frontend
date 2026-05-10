import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import hi from "./locales/hi.json";
import aw from "./locales/aw.json";

export const SUPPORTED_LANGUAGES = [
  { code: "hi", labelKey: "language.hindi",   nativeLabel: "हिंदी",   short: "हि" },
  { code: "aw", labelKey: "language.awadhi",  nativeLabel: "अवधी",    short: "अव" },
  { code: "en", labelKey: "language.english", nativeLabel: "English", short: "EN" },
];

const STORAGE_KEY = "lang";
const DEFAULT_LANG = "hi";

const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
const validLang = SUPPORTED_LANGUAGES.some(l => l.code === saved) ? saved : DEFAULT_LANG;

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      aw: { translation: aw },
    },
    lng: validLang,
    fallbackLng: "hi",
    interpolation: { escapeValue: false },
    returnNull: false,
  });

export const setLanguage = (lng) => {
  i18n.changeLanguage(lng);
  localStorage.setItem(STORAGE_KEY, lng);
  document.documentElement.lang = lng;
};

if (typeof document !== "undefined") {
  document.documentElement.lang = validLang;
}

export default i18n;
