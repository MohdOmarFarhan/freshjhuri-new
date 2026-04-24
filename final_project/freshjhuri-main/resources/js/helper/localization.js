import { useI18n } from "vue-i18n";
import { setCookie } from "@/lib/utils";

export function useLocalization() {
  const { locale, t } = useI18n();
  
  const changeLanguage = (lang) => {
    locale.value = lang;
    localStorage.setItem('selectedLanguage', lang);
    setCookie('locale', lang);
    document.documentElement.lang = lang;
    document.body.className = lang === 'en' ? 'font-sans' : 'font-bengali';
  };

  const toBanglaNumber = (number) => {
    const englishToBangla = {
      '0': '০',
      '1': '১',
      '2': '২',
      '3': '৩',
      '4': '৪',
      '5': '৫',
      '6': '৬',
      '7': '৭',
      '8': '৮',
      '9': '৯'
    };
    return String(number).replace(/[0-9]/g, digit => englishToBangla[digit]);
  };

  const toEnglishNumber = (number) => {
    const banglaToEnglish = {
      '০': '0',
      '১': '1',
      '২': '2',
      '৩': '3',
      '৪': '4',
      '৫': '5',
      '৬': '6',
      '৭': '7',
      '৮': '8',
      '৯': '9'
    };
    return String(number).replace(/[০-৯]/g, digit => banglaToEnglish[digit]);
  };

  return { locale, t, changeLanguage, toBanglaNumber, toEnglishNumber };
}
