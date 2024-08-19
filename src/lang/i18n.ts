import { use } from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enUS from './locales/en-US.json';
import zhCN from './locales/zh-CN.json';
import arSA from './locales/ar-SA.json';
import bnBD from './locales/bn-BD.json';
import deDE from './locales/de-DE.json';
import esES from './locales/es-ES.json';
import frFR from './locales/fr-FR.json';
import itIT from './locales/it-IT.json';
import ptPT from './locales/pt-PT.json';
import ruRU from './locales/ru-RU.json';
import trTR from './locales/tr-TR.json';
import viVN from './locales/vi-VN.json';
import jaJP from './locales/ja-JP.json';
import koKR from './locales/ko-KR.json';
import zhTW from './locales/zh-TW.json';
const resources = {
  'ar-SA': {
    translation: arSA
  },
  'bn-BD': {
    translation: bnBD
  },
  'de-DE': {
    translation: deDE
  },
  'en-US': {
    translation: enUS
  },
  'es-ES': {
    translation: esES
  },
  'fr-FR': {
    translation: frFR
  },
  'it-IT': {
    translation: itIT
  },
  'pt-PT': {
    translation: ptPT
  },
  'ru-RU': {
    translation: ruRU
  },
  'tr-TR': {
    translation: trTR
  },
  'vi-VN': {
    translation: viVN
  },
  'ja-JP': {
    translation: jaJP
  },
  'ko-KR': {
    translation: koKR
  },
  'zh-CN': {
    translation: zhCN
  },
  'zh-TW': {
    translation: zhTW
  }
};

const currentLocale = localStorage.getItem('lang') || 'en-US';
const i18n = use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: currentLocale,
    lng: currentLocale,
    debug: true,
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
