import i18next from 'i18next';
import resources from './locales/es.js';

const i18nReady = i18next.init({
  lng: 'es',
  fallbackLng: 'es',
  resources: {
    es: resources,
  },
});

export { i18next, i18nReady };
