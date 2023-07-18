export const grapqlConfig = {
  graphiql: true
}

export const i18nConfig = {
  load: 'currentOnly', // Only load languages specified in supportedLngs.
  keySeparator: '.',
  backend: {
    loadPath: process.env.TRANSLATION_DIR + '/{{lng}}.json' // Where to load language files. Relative to this file path.
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
