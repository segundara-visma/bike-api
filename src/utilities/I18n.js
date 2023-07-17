import i18next from 'i18next'
import i18backend from 'i18next-fs-backend'
import middleware from 'i18next-http-middleware'

import { i18nConfig } from '../config/app.js'

const localeHelper = function (locale) {
  switch (locale) {
  case 'en':
    return 'en-US'
  case 'fi':
  default:
    return 'fi-FI'
  }
}
const myDetector = {
  name: 'myDetectorsName',

  lookup: function (req) {
    if (req.query.lng) {
      const queryLng = req.query.lng.split('-')[0]
      // Add support for just the locale part of the language code.
      return localeHelper(queryLng)
    }
    // Get the language from the header.
    const acceptLng = req.headers['accept-language']
    if (acceptLng) {
      // The header can contain multiple languages, separated by a semicolon.
      const lngs = acceptLng.split(';')
      for (const lng of lngs) {
        if (i18nConfig.supportedLngs.includes(lng)) {
          return lng
        }
        return localeHelper(i18nConfig)
      }
    }

    return i18nConfig.fallbackLng
  }
}

// Modify the order of the detectors and add custom detector as the first detector.
const newOrder = i18nConfig.detection.order.slice()
newOrder.unshift('myDetectorsName')
i18nConfig.detection.order = newOrder

const lngDetector = new middleware.LanguageDetector()
lngDetector.addDetector(myDetector)

i18next.use(i18backend).use(lngDetector).init({
  ...i18nConfig
})

export {i18next}
