import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

/* ── Supported language codes ── */
export const SUPPORTED_LANGS = [
  'en', 'hi', 'mr', 'gu', 'pa', 'ta', 'te', 'kn', 'ml', 'bn',
  'fr', 'de', 'es', 'ja', 'zh', 'ru', 'ar',
];

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    /* ── Backend: load JSON files from /public/locales ── */
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },

    /* ── Supported locales ── */
    supportedLngs: SUPPORTED_LANGS,
    fallbackLng: 'en',
    defaultNS: 'translation',

    /* ── Detection order ── */
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'setuhealth_lang',
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false, // React already escapes
    },

    /* ── Lazy load; don't block initial render ── */
    react: {
      useSuspense: false,
    },
  });

export default i18n;
