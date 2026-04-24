import { createI18n } from 'vue-i18n';
import messages from '../lang/index';

const savedLanguage = typeof window !== 'undefined' ? localStorage.getItem('selectedLanguage') : null;
const defaultLocale = savedLanguage || 'bn';

// Apply initial font class and lang attribute
if (typeof window !== 'undefined') {
    document.documentElement.lang = defaultLocale;
    document.body.className = defaultLocale === 'en' ? 'font-sans' : 'font-bengali';
}

const i18n = createI18n({
  locale: defaultLocale,
  fallbackLocale: 'bn',
  legacy: false, // Set to false to use Composition API
  globalInjection: true,
  messages,
});

export default i18n;
