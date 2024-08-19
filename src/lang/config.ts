import china from '@/assets/flags/china.png';
import hongkong from '@/assets/flags/hongkong.png';
import germany from '@/assets/flags/germany.png';
import spain from '@/assets/flags/spain.png';
import france from '@/assets/flags/france.png';
import britain from '@/assets/flags/britain.png';
import japan from '@/assets/flags/japan.png';
import korea from '@/assets/flags/korea.png';
import türkiye from '@/assets/flags/türkiye.png';
import vietnam from '@/assets/flags/vietnam.png';
import saudi from '@/assets/flags/saudi_arabia.png';
import bangladesh from '@/assets/flags/bangladesh.png';
import italy from '@/assets/flags/italy.png';
import portugal from '@/assets/flags/portugal.png';
import russia from '@/assets/flags/russia.png';

export const fallbackLng = 'en';
export const languages = [fallbackLng, 'zh-CN', 'zh-TW'];
export const arrLang = [
  {
    label: 'العربية',
    value: 'ar-SA',
    logo: saudi
  },
  {
    label: 'বাংলা',
    value: 'bn-BD',
    logo: bangladesh
  },
  {
    label: 'Deutsch',
    value: 'de-DE',
    logo: germany
  },
  {
    label: 'English',
    value: 'en-US',
    logo: britain
  },
  {
    label: 'Español',
    value: 'es-ES',
    logo: spain
  },
  {
    label: 'Français',
    value: 'fr-FR',
    logo: france
  },
  {
    label: 'Italiano',
    value: 'it-IT',
    logo: italy
  },
  {
    label: 'Português',
    value: 'pt-PT',
    logo: portugal
  },
  {
    label: 'Pусский',
    value: 'ru-RU',
    logo: russia
  },
  {
    label: 'Türkçe',
    value: 'tr-TR',
    logo: türkiye
  },
  {
    label: 'Tiếng Việt',
    value: 'vi-VN',
    logo: vietnam
  },
  {
    label: '日本語',
    value: 'ja-JP',
    logo: japan
  },
  {
    label: '한국어',
    value: 'ko-KR',
    logo: korea
  },
  {
    label: '中文简体',
    value: 'zh-CN',
    logo: china
  },
  {
    label: '中文繁体',
    value: 'zh-TW',
    logo: hongkong
  }
];
export const defaultNS = 'translation';
export const cookieName = 'i18next';
export type ILanguages = 'en' | 'zh-CN' | 'zh-TW';
