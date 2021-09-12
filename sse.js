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
* An example of a GET routing handler for a Service Send Event implementation
* (used in https://app.hearit.io/sse).
*
* Author: Emil Usunov, hearit.io
*
* License: MIT
*
*/
// ============================================================================|

'use strict'

const {
  messageSourceId,
  pingIntervalMs
} = require('./constants.js')

// ----------------------------------------------------------------------------|
// A SSE (Service Send Event) route handler
// ----------------------------------------------------------------------------|
module.exports = async function (request, reply) {
  const fastify = this

  try {

    // Get a last event id form the headers or form a query 
    let lastEventId =  request.headers['last-event-id']
    if (typeof lastEventId === typeof undefined) {
      lastEventId = request.query.id
    }

    // Subscribe for a tunnel
    const tunnel = await fastify.channels.use(messageSourceId)
    await fastify.channels.subscribe(tunnel)

    // Unsubscribe on a connection close.
    request.raw.addListener('close', async (event) => {
      await fastify.channels.unsubscribe(tunnel)
    })

    // Start SSE using an asynchronious iterator function.
    reply.sse(consume(fastify.channels, tunnel, pingIntervalMs, lastEventId))

    return reply
  } catch (error) {
    console.error ('SSE handler : ', error)
  }
}

// ----------------------------------------------------------------------------|
// A channel consumer implementation which supports following functionality:
//
// 1. Starts a consuming from a given period in the past using 'lastEventId'.
//
// 2. Produces a 'gap' named SSE event message in a case of a missing events
//    (there is a channel size overflow).
//
// 3. Produces a 'ping' named SSE event message on each blocking timeout.
// ----------------------------------------------------------------------------|
async function * consume (channel, tunnel, blockTimeOutMs, lastEventId) {
  try {

    let checkForGap = true
    let startConsumeFromId = lastEventId

    let lastTimeStampMs
    let lastCounter

    // Build a previous id. A format of a lastEventId is <timestamp>-<sequence>
    if (typeof lastEventId !== typeof undefined) {
      [lastTimeStampMs, lastCounter] = lastEventId.split('-')
      lastCounter = parseInt(lastCounter)
      lastTimeStampMs = parseInt(lastTimeStampMs)
      if (lastCounter > 0) {
        startConsumeFromId = `${lastTimeStampMs}-${lastCounter-1}`
      } else {
        startConsumeFromId = `${lastTimeStampMs-1}-0`
      }
    }

    // Consume form a channel
    for await (const messages of channel.consume(tunnel, undefined, undefined,
        blockTimeOutMs, startConsumeFromId, true)) {

      for (const i in messages) {
        const id = messages[i].id || ''

        // Produce a 'ping' message
        if (messages[i].data === null) {
          yield ({ id: id, event: 'ping', data: 'ping' })
          checkForGap = false
          continue
        }

        // Check for a gap in a message id
        if (checkForGap && typeof lastEventId !== typeof undefined) {
          let [timeStampMs, counter] = messages[i].id.split('-')
          counter = parseInt(counter)
          timeStampMs = parseInt(timeStampMs)

          // Skip all older messages
          if (timeStampMs < lastTimeStampMs || counter < lastCounter) {
            continue
          }
          checkForGap = false

          // Produce a 'gap' message
          if (messages[i].id !== lastEventId) {
            yield ({ id: messages[i].id, event: 'gap', data: 'gap' })
          } else {
            // Skip the message with the last event id.
            continue
          }
        }

        yield (messages[i])
        checkForGap = false
      }
    }

  } catch (error) {
    console.error('consume : ', error)
    throw error
  }
}
