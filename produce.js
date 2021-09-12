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
* A message producer for a SSE example
* (used in a similar way in https://app.hearit.io).
*
* Usage:
*
* node produce 'Hello'
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
} = require('./constants.js')

const {RedisChannels} = require('@hearit-io/redis-channels')

// ----------------------------------------------------------------------------|
async function main () {
  const channel = new RedisChannels()

  const tunnel = await channel.use(messageSourceId)
  const id = await channel.produce(tunnel, process.argv[2]) 
  console.log(`Produced (${messageSourceId}) id : ${id}`)
  process.exit(0)
}

main().catch ( error => {
  console.error(error)
  process.exit(1)
})
