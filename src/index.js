console.clear()

const port = process.env.APP_PORT || 3300
import http from 'http'

import { ApolloServer } from 'apollo-server-express'
import express from 'express'

import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs'
import depthLimit from 'graphql-depth-limit'

// Wrapper for localization vendor...
import {i18next} from './utilities/I18n.js'

// Vendors - Middlewares
import i18nextMiddleware from 'i18next-http-middleware'

// Our GraphQL Schema
import {schema} from './graphql/schema.js'

import gpl from 'graphql-tag'
import {Logger} from './utilities/Logger.js'
import whiteList from './config/cross-site-origins.json' assert { type: "json" }

async function startApolloServer (schema, endpoint, port, middlewares) {
  const app = express()
  // Support json encoded bodies
  app.use(express.json())
  // Support encoded bodies
  app.use(express.urlencoded({ extended: true }))

  // Detect and localize applications messages.
  app.use(i18nextMiddleware.handle(i18next))

  // Serve static files from public. NEED TO BE AFTER ALLOWED ORIGINS
  app.use(express.static('public'))
  // app.use(graphqlUploadExpress({ maxFileSize: 100000000, maxFiles: 10 }))
  app.use(graphqlUploadExpress({ maxFiles: 10 }))

  // Create HTTP server.
  const httpServer = http.createServer(app)

  const cors = { origin: [] }
  if (whiteList) {
    if (Array.isArray(whiteList.urls)) {
      cors.origin = whiteList.urls
    }
  }

  let __
  // Initialize audit trail so we can pass it to the error handler aswell.
  let auditTrail

  // TODO Refactor: Create context
  const context = async function ({ req }) {
    __ = req.i18n.t.bind(req.i18n)
    auditTrail = new Logger('graphqlAccessLog')

    for (const mw in middlewares) {
      req = await middlewares[mw](req)
    }

    let operationName = 'bikeTrips'
    if (req.body.query) {
      const gplObj = gpl`
      ${req.body.query}
      `
      operationName = gplObj.definitions[0].selectionSet.selections[0].name.value
    }

    // Create payload for the audit trail.
    const loggerPayload = {
      action: operationName,
      type: req.body.query ? req.body.query.split(' ')[0] : 'query'
    }

    auditTrail.setStickyParams(loggerPayload)

    // Return the whole context.
    return {
      __,
      auditTrail
    }
  }

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cors,
    path: endpoint,
    validationRules: [depthLimit(6)],
    context,
    formatError: (err) => {
      if (!err.originalError && !err.extensions) {
        return err
      }

      if (process.env.ENVIRONMENT !== 'production') {
        console.log(err)
      }

      let errObj
      if (err.originalError) {
        errObj = err.originalError
      } else if (err.extensions.originalError) {
        errObj = err.extensions.originalError
      }

      const data = errObj?.data ? errObj.data : {}
      const message = errObj.message || 'An error occurred.'
      const code = errObj.code

      // Error message payload for audit trail.
      const payload = {
        error: {
          data,
          code
        }
      }

      if (err.extensions) {
        if (err.extensions.exception) {
          if (err.extensions.exception.stacktrace) {
            payload.error.stacktrace = err.extensions.exception.stacktrace
            console.error('THE STACK TRACE', err.extensions.exception.stacktrace)
          }
        }
      }

      if (code >= 500) {
        auditTrail.fatal(message, payload)
      } else {
        auditTrail.warn(message, payload)
      }

      return {
        data,
        status: code,
        message: __(message),
        stacktrace: err.extensions.exception.stacktrace
      }
    }
  })

  await server.start()

  server.applyMiddleware({
    app,
    path: endpoint
  })

  await new Promise(resolve => httpServer.listen({ port }, resolve))
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`)
}

startApolloServer(schema, '/graphql', port, [])
