import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const grapqlConfig = {
  graphiql: true
}

export const i18nConfig = {
  load: 'currentOnly', // Only load languages specified in supportedLngs.
  keySeparator: '.',
  backend: {
    loadPath: __dirname + '/../static/i18n/{{lng}}.json' // Where to load language files. Relative to this file path.
  },
  interpolation: {
    escapeValue: false // Do not escape variables.
  },
  detection: {
    order: [ 'querystring', 'header' ]
  },
  supportedLngs: [
    'fi-FI', 'en-US'
  ],
  fallbackLng: 'en-US'
}
