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
* A constants used for a SSE example.
*
* Author: Emil Usunov, hearit.io
*
* License: MIT
*
*/
// ============================================================================|
'use strict'


// A channel id used in a consumer and a producer.
const messageSourceId = 'stock'

// A ping intervals (30 seconds) used in consumer and in the frontend.
const pingIntervalMs = 30000

module.exports = { messageSourceId, pingIntervalMs }
