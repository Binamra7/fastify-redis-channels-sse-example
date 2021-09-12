// ============================================================================|
/*
* Project : HEARIT.IO
*
* Developing an innovative connected/smart home intelligent
* management system for the needs of blind or visually impaired
* persons.
*
* Purpose:
*
* A fastify server for a SSE example
* (used in a similar way in https://app.hearit.io).
*
* Author: Emil Usunov, hearit.io
*
* License: MIT
*
*/
// ============================================================================|
'use strict'

const fastify = require('fastify')()

// The route handlers for '/' and '/sse' paths.
const homeHandler = require('./home.js')
const sseHandler = require('./sse.js')

// A Redis channel plugin
fastify.register(require('fastify-redis-channels'))
fastify.ready(error => {
  if (error) console.log(error)
})

// An SSE plugin
fastify.register(require('fastify-sse-v2').FastifySSEPlugin)
fastify.ready(error => {
  if (error) console.log(error)
})

// Set the GET routes.
fastify.get('/', homeHandler)
fastify.get('/sse', sseHandler)


// Start a Fastify
fastify.listen({port: 3333}, (error, address) => {
  if (error) console.log(error)
  console.log('Listen on : ', address)
})
